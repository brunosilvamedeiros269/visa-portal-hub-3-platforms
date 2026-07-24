#!/usr/bin/env python3
"""
Script de Carga Automática de Projetos Visa no OpenProject
Uso: python seed_openproject.py <SUA_CHAVE_API_OU_SENHA_ADMIN>
"""

import sys
import json
import base64
import urllib.request
import urllib.error

BASE_URL = "http://localhost:8082"

PROJECTS_DATA = [
    {
        "name": "Programa Onboarding & Wallets — Banco Alfa",
        "identifier": "banco-alfa-wallets",
        "description": "Projeto Macro para Habilitação VTS, Apple Pay e Requisitos do Mandato ISO 8583 Field 48.",
        "subprojetos": [
            {"name": "Micro-Projeto 1: Integração SDK Apple Pay iOS", "identifier": "alfa-apple-pay-sdk"},
            {"name": "Micro-Projeto 2: Servidor VTS Token Requestor", "identifier": "alfa-vts-token-requestor"},
            {"name": "Micro-Projeto 3: Adaptação ISO 8583 Field 48", "identifier": "alfa-iso-field-48"}
        ]
    },
    {
        "name": "Programa Expand Mobile Wallets — Banco Sul",
        "identifier": "banco-sul-wallets",
        "description": "Projeto Macro focado em Google Pay e Wearables (Garmin Pay / Fitbit Pay) no Cone Sul.",
        "subprojetos": [
            {"name": "Micro-Projeto 1: Provisionamento Google Wallet Android", "identifier": "sul-gpay-android"},
            {"name": "Micro-Projeto 2: Habilitação Garmin Pay VTS", "identifier": "sul-garmin-pay-vts"}
        ]
    },
    {
        "name": "Programa Click to Pay & Direct Payments — Fintech Uruguai",
        "identifier": "fintech-uruguai-ctp",
        "description": "Projeto Macro de e-commerce seguro com Click to Pay e liquidação via OCT.",
        "subprojetos": [
            {"name": "Micro-Projeto 1: Setup Click to Pay Web SDK", "identifier": "uruguai-ctp-sdk"}
        ]
    }
]

def create_project(auth_header, name, identifier, description, parent_id=None):
    url = f"{BASE_URL}/api/v3/projects"
    payload = {
        "name": name,
        "identifier": identifier,
        "description": {"format": "markdown", "raw": description}
    }
    if parent_id:
        payload["_links"] = {"parent": {"href": f"/api/v3/projects/{parent_id}"}}

    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": auth_header,
            "Content-Type": "application/json",
            "Accept": "application/hal+json"
        },
        method="POST"
    )

    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            print(f"✅ Projeto criado: {name} (ID: {data.get('id')})")
            return data.get("id")
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f"⚠️ Erro ao criar '{name}': {e.code} - {body}")
        return None

def main():
    if len(sys.argv) < 2:
        print("Uso: python seed_openproject.py <SUA_API_KEY_OPENPROJECT>")
        sys.exit(1)

    api_key = sys.argv[1].strip()
    auth_bytes = f"apikey:{api_key}".encode("utf-8")
    auth_header = "Basic " + base64.b64encode(auth_bytes).decode("utf-8")

    print(f"🚀 Iniciando carga de Projetos Macro e Subprojetos no OpenProject ({BASE_URL})...\n")

    for macro in PROJECTS_DATA:
        parent_id = create_project(auth_header, macro["name"], macro["identifier"], macro["description"])
        if parent_id:
            for sub in macro.get("subprojetos", []):
                create_project(auth_header, sub["name"], sub["identifier"], f"Subprojeto técnico de {macro['name']}", parent_id)

    print("\n🎉 Carga finalizada com sucesso!")

if __name__ == "__main__":
    main()
