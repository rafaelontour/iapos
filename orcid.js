require("dotenv").config();
const express = require("express");
const axios = require("axios");
const admin = require("firebase-admin");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

admin.initializeApp({
  credential: admin.credential.cert(require("./firebase-adminsdk.json")),
});

// Rota ORCID callback
app.get("/auth/orcid/callback", async (req, res) => {
  const { code } = req.query;

  if (!code) return res.status(400).json({ error: "Código não fornecido" });

  try {
    // Troca o code por access_token
    const tokenResponse = await axios.post("https://orcid.org/oauth/token", null, {
      params: {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.REDIRECT_URI,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
    });

    const { access_token, orcid } = tokenResponse.data;

    // Buscar nome e email do usuário
    const profileResponse = await axios.get(`https://pub.orcid.org/v3.0/${orcid}/person`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: "application/json",
      },
    });

    const profile = profileResponse.data;

    const nome = profile?.name?.["given-names"]?.value || "Sem Nome";
    const sobrenome = profile?.name?.["family-name"]?.value || "Sem Sobrenome";

    // Email pode não estar disponível
    const email =
      profile?.emails?.email?.[0]?.email || `${orcid.replace(/-/g, "")}@orcid.fake`;

    const userPayload = {
      user: {
        email,
        nome,
        sobrenome,
        data_nascimento: "01011990", // ORCID não fornece — valor padrão ou randomizado
      },
      orcid_id: orcid,
    };

    return res.json(userPayload);
  } catch (error) {
    console.error("Erro ORCID:", error.response?.data || error);
    return res.status(500).json({ error: "Erro ao autenticar com ORCID" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
