require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { BetaAnalyticsDataClient } = require("@google-analytics/data");
const nodemailer = require("nodemailer");
const fetch = require('node-fetch');
const https = require('https');

const axios = require('axios');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

const app = express();
app.use(cors());
app.use(bodyParser.json());
const port = process.env.VITE_PORT || 3000

process.env.GOOGLE_APPLICATION_CREDENTIALS = "./chave.json";

const analyticsDataClient = new BetaAnalyticsDataClient();

// Middleware
app.use(cors());
app.use(express.json()); // Para receber JSON no corpo da requisição

// Rota para buscar dados do Google Analytics
app.get("/api/analytics", async (req, res) => {
    try {
        const [response] = await analyticsDataClient.runReport({
            property: `properties/${process.env.VITE_GA4_PROPERTY_ID}`,
            dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
            dimensions: [
                { name: "date" },
                { name: "eventName" },
                { name: "country" },
                { name: "hostName" } // Adicionando a dimensão de host
            ],
            metrics: [{ name: "eventCount" }, { name: "activeUsers" }],
            orderBys: [{ dimension: { dimensionName: "date" }, desc: false }],
            dimensionFilter: {
                filter: {
                    fieldName: "hostName",
                    stringFilter: {
                        matchType: "EXACT",
                        value: process.env.VITE_URL_SITE

                    }
                }
            }
        });

        res.json(response);
    } catch (error) {
        console.error("Erro ao buscar dados do GA4:", error);
        res.status(500).json({ error: "Erro ao buscar dados do Google Analytics" });
    }
});

// Configuração do Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true", // true para 465, false para 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Função para obter credenciais e configuração SMTP de acordo com a plataforma
function getMailCredentials(platform) {
  if (platform === 'conectee') {
    return {
      user: process.env.SMTP_USER_CONECTEE,
      pass: process.env.SMTP_PASS_CONECTEE,
      host: process.env.SMTP_HOST_CONECTEE,
      port: Number(process.env.SMTP_PORT_CONECTEE),
      secure: Number(process.env.SMTP_PORT_CONECTEE) === 465, // true para 465, false para 587
    };
  }
  return {
    user: process.env.SMTP_USER_SIMCC,
    pass: process.env.SMTP_PASS_SIMCC,
    host: process.env.SMTP_HOST_SIMCC,
    port: Number(process.env.SMTP_PORT_SIMCC),
    secure: Number(process.env.SMTP_PORT_SIMCC) === 465,
  };
}

admin.initializeApp({
  credential: admin.credential.cert(require('./firebase-adminsdk.json')),
});

// ORCID → troca code por access_token → cria token Firebase
app.post('/api/orcid/exchange-code', async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'Código não enviado' });

  try {
    const tokenRes = await axios.post('https://orcid.org/oauth/token', null, {
      params: {
        client_id: process.env.VITE_CLIENT_ID,
        client_secret: process.env.VITE_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.VITE_REDIRECT_URI,
      },
      headers: {
        Accept: 'application/json',
      },
    });

    const { access_token, orcid } = tokenRes.data;

    // Aqui você pode opcionalmente buscar mais dados da ORCID API com esse access_token

    const customToken = await admin.auth().createCustomToken(orcid);

    return res.json({ firebase_token: customToken, orcid_id: orcid });
  } catch (err) {
    console.error(err.response?.data || err);
    return res.status(500).json({ error: 'Erro ao autenticar com ORCID' });
  }
});

// Iniciando o servidor
app.listen(port, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});
