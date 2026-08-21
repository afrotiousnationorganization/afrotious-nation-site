const fetch = require("node-fetch");

exports.handler = async (event) => {
  const formName = event.queryStringParameters.form;

  const NETLIFY_API = "https://api.netlify.com/api/v1";
  const TOKEN = process.env.NETLIFY_API_TOKEN;

  try {
    const formsRes = await fetch(`${NETLIFY_API}/forms`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    const forms = await formsRes.json();

    const form = forms.find(f => f.name === formName);

    if (!form) {
      return {
        statusCode: 404,
        body: JSON.stringify([])
      };
    }

    const subsRes = await fetch(`${NETLIFY_API}/forms/${form.id}/submissions`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    const submissions = await subsRes.json();

    return {
      statusCode: 200,
      body: JSON.stringify(submissions)
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
