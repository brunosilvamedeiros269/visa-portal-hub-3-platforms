---
tags: ["tecnico"]
fuente: Guías de la carpeta + fuentes públicas
estado: verificado
title: "Google Pay — Claves VDP y criptografía"
---

# Google Pay — Claves [[VDP (Visa Developer Platform)|VDP]] y criptografía

El **[[VDP (Visa Developer Platform)|VDP]]** dejó de entregar el *Shared Secret* por el software → el emisor + [[ITSP]] generan las claves, con **segregación de funciones** (la clave queda solo en manos del emisor).

## En el [[VDP (Visa Developer Platform)|Visa Developer Platform]]
1. Login en el [[VDP (Visa Developer Platform)|VDP]] → abrir "Visa Digital Services Project".
2. Settings → Project Name (anteponer el nombre del banco). Description → caso de uso (Apple / Google / Issuer Wallet).
3. Credentials → **API Key Inbound** + instrucciones para crear el **Shared Secret** (sitio X-Pay Token).
4. Configuration → API Key & Shared Secret (Outbound & Encryption).
5. Users → panel admin; aplicar segregación de funciones (solo los roles necesarios por usuario).

## Par de claves (OpenSSL)
```bash
# clave privada y pública (RSA 2048)
openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048
openssl rsa -pubout -in private_key.pem -out public_key.pem
# subir la pública al VDP: quitar header/footer y saltos de línea
cat public_key.pem | tr -d '\r\n'
# descifrar el Shared Secret con la privada (base64 + RSA-OAEP / SHA-256)
cat encrypted_shared_secret.txt | base64 --decode > decoded.bin
openssl pkeyutl -decrypt -in decoded.bin -inkey private_key.pem -pkeyopt rsa_padding_mode:oaep -pkeyopt rsa_oaep_md:sha256 > shared_secret.txt
```

---
[[Home]]
