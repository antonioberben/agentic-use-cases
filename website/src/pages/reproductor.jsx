import React, {useEffect} from 'react';
import {useHistory, useLocation} from '@docusaurus/router';
import Layout from '@theme/Layout';

// Ruta legacy: redirige a /casos-de-uso/detalle conservando el querystring.
export default function ReproductorLegacyRedirect() {
  const history = useHistory();
  const location = useLocation();
  useEffect(() => {
    history.replace({pathname: '/casos-de-uso/detalle', search: location.search});
  }, [history, location.search]);
  return <Layout title="Redirigiendo…"><main style={{padding: 48}}>Redirigiendo…</main></Layout>;
}
