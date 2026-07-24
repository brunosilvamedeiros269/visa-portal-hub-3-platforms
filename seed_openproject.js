// Script de Carga Automática em Node.js para OpenProject (http://localhost:8082)

const BASE_URL = "http://localhost:8082";

const PROJECTS_DATA = [
  {
    name: "Programa Onboarding & Wallets — Banco Alfa",
    identifier: "banco-alfa-wallets",
    description: "Projeto Macro para Habilitação VTS, Apple Pay e Requisitos do Mandato ISO 8583 Field 48.",
    subprojetos: [
      { name: "Micro-Projeto 1: Integração SDK Apple Pay iOS", identifier: "alfa-apple-pay-sdk" },
      { name: "Micro-Projeto 2: Servidor VTS Token Requestor", identifier: "alfa-vts-token-requestor" },
      { name: "Micro-Projeto 3: Adaptação ISO 8583 Field 48", identifier: "alfa-iso-field-48" }
    ]
  },
  {
    name: "Programa Expand Mobile Wallets — Banco Sul",
    identifier: "banco-sul-wallets",
    description: "Projeto Macro focado em Google Pay e Wearables (Garmin Pay / Fitbit Pay) no Cone Sul.",
    subprojetos: [
      { name: "Micro-Projeto 1: Provisionamento Google Wallet Android", identifier: "sul-gpay-android" },
      { name: "Micro-Projeto 2: Habilitação Garmin Pay VTS", identifier: "sul-garmin-pay-vts" }
    ]
  },
  {
    name: "Programa Click to Pay & Direct Payments — Fintech Uruguai",
    identifier: "fintech-uruguai-ctp",
    description: "Projeto Macro de e-commerce seguro com Click to Pay e liquidação via OCT.",
    subprojetos: [
      { name: "Micro-Projeto 1: Setup Click to Pay Web SDK", identifier: "uruguai-ctp-sdk" }
    ]
  }
];

async function createProject(authHeader, name, identifier, description, parentId = null) {
  const payload = {
    name,
    identifier,
    description: { format: 'markdown', raw: description }
  };

  if (parentId) {
    payload._links = { parent: { href: `/api/v3/projects/${parentId}` } };
  }

  try {
    const res = await fetch(`${BASE_URL}/api/v3/projects`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        'Accept': 'application/hal+json'
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (res.ok) {
      console.log(`✅ Criado: ${name} (ID: ${data.id})`);
      return data.id;
    } else {
      console.log(`⚠️ Aviso ao criar '${name}':`, data.message || JSON.stringify(data));
      return null;
    }
  } catch (err) {
    console.error(`❌ Erro ao criar '${name}':`, err.message);
    return null;
  }
}

async function run() {
  const apiKey = process.argv[2] || "c74bb8c5e5b7ae08a74393e9c0deea3d2721fcd96cf445490677ee945d7230f6";
  const authHeader = 'Basic ' + Buffer.from('apikey:' + apiKey.trim()).toString('base64');

  console.log(`🚀 Criando Projetos Macro e Subprojetos no OpenProject (${BASE_URL})...\n`);

  for (const macro of PROJECTS_DATA) {
    const parentId = await createProject(authHeader, macro.name, macro.identifier, macro.description);
    if (parentId) {
      for (const sub of macro.subprojetos) {
        await createProject(authHeader, sub.name, sub.identifier, `Subprojeto técnico de ${macro.name}`, parentId);
      }
    }
  }

  console.log("\n🎉 Carga concluída com sucesso!");
}

run();
