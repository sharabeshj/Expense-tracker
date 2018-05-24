

const redirect = (props) => {
    window.location=  'https://staging.fyle.in/#/auth/oauth?client_id=' + props.match.params.clientId + '&redirect_uri=http://127.0.0.1:3000/expenses/';
}

export default redirect;