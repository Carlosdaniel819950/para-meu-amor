# 📸 Como fazer upload das suas fotos

## 🎯 Objetivo
Manter suas fotos privadas no GitHub, mas funcionando no Render.

## 🔧 Soluções Gratuitas

### 1. **Imgur (Recomendado)**
1. Acesse: https://imgur.com
2. Clique em "New Post"
3. Arraste suas 3 fotos
4. Copie os links das imagens
5. Cole os links no `server.js` (linhas 90-92)

### 2. **Google Drive**
1. Faça upload das fotos no Google Drive
2. Clique com botão direito → "Obter link"
3. Mude para "Qualquer pessoa com o link"
4. Copie o link e substitua por: `https://drive.google.com/uc?id=SEU_ID_AQUI`

### 3. **Dropbox**
1. Faça upload no Dropbox
2. Clique com botão direito → "Compartilhar"
3. Mude para "Público"
4. Copie o link

## 🔄 Como atualizar o código

No arquivo `server.js`, linhas 90-92, substitua:

```javascript
const photoUrls = {
  'assets/foto1.jpg': 'https://via.placeholder.com/300x400/ff69b4/ffffff?text=Sua+Foto+1',
  'assets/foto2.jpg': 'https://via.placeholder.com/300x400/ff69b4/ffffff?text=Sua+Foto+2', 
  'assets/foto3.jpg': 'https://via.placeholder.com/300x400/ff69b4/ffffff?text=Sua+Foto+3'
};
```

Por:

```javascript
const photoUrls = {
  'assets/foto1.jpg': 'https://i.imgur.com/SUA_IMAGEM_1.jpg',
  'assets/foto2.jpg': 'https://i.imgur.com/SUA_IMAGEM_2.jpg', 
  'assets/foto3.jpg': 'https://i.imgur.com/SUA_IMAGEM_3.jpg'
};
```

## ✅ Vantagens desta solução

- ✅ Fotos não ficam no GitHub
- ✅ Fotos funcionam no Render
- ✅ Totalmente privado
- ✅ Gratuito
- ✅ Fácil de atualizar

## 🚀 Após fazer upload

1. Atualize as URLs no `server.js`
2. Faça commit: `git add . && git commit -m "Atualizando URLs das fotos" && git push`
3. O Render fará deploy automático
4. Teste o site!

## 🔒 Segurança

- Suas fotos ficam em serviços externos
- GitHub não tem acesso às fotos
- Apenas quem tem a senha vê as fotos
- URLs das fotos ficam no código, mas são privadas
