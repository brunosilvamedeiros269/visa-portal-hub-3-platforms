---
tags: ["tecnico"]
---

# Google Pay — Chaves [[VDP (Visa Developer Platform)|VDP]] e criptografia

O **[[VDP (Visa Developer Platform)|VDP]]** deixou de fornecer o *Shared Secret* pelo software → o emissor + [[ITSP]] geram as chaves, com **segregação de funções** (a chave fica só com o emissor).

## No [[VDP (Visa Developer Platform)|Visa Developer Platform]]
1. Login no [[VDP (Visa Developer Platform)|VDP]] → abrir "Visa Digital Services Project".
2. Settings → Project Name (prefixe o nome do banco). Description → caso de uso (Apple / Google / Issuer Wallet).
3. Credentials → **API Key Inbound** + instruções para criar o **Shared Secret** (site X-Pay Token).
4. Configuration → API Key & Shared Secret (Outbound & Encryption).
5. Users → painel admin; aplicar segregação de funções (só os papéis necessários por usuário).

## Par de chaves (OpenSSL)
```bash
# chave privada e pública (RSA 2048)
openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048
openssl rsa -pubout -in private_key.pem -out public_key.pem
# subir a pública no VDP: remover header/footer e quebras de linha
cat public_key.pem | tr -d '\r\n'
# decifrar o Shared Secret com a privada (base64 + RSA-OAEP / SHA-256)
cat encrypted_shared_secret.txt | base64 --decode > decoded.bin
openssl pkeyutl -decrypt -in decoded.bin -inkey private_key.pem -pkeyopt rsa_padding_mode:oaep -pkeyopt rsa_oaep_md:sha256 > shared_secret.txt
```

---
[[Home]]
