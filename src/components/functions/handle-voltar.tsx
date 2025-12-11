import { useLocation, useNavigate } from "react-router-dom";


export   const handleVoltar = () => {
    const navigate = useNavigate();
  const location = useLocation();

    const currentPath = location.pathname;
    const hasQueryParams = location.search.length > 0;
    
    if (hasQueryParams) {
      // Se tem query parameters, remove apenas eles
      navigate(currentPath);
    } else {
      // Se não tem query parameters, remove o último segmento do path
      const pathSegments = currentPath.split('/').filter(segment => segment !== '');
      
      if (pathSegments.length > 1) {
        pathSegments.pop();
        const previousPath = '/' + pathSegments.join('/');
        navigate(previousPath);
      } else {
        // Se estiver na raiz ou com apenas um segmento, vai para raiz
        navigate('/');
      }
    }
  };