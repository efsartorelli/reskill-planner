# ReSkill Planner (SkillUpPlus2030+)

Aplicativo mobile feito com **React Native + Expo**, focado em requalificação profissional para a área de tecnologia.

O app ajuda pessoas que querem migrar de carreira a organizar seus estudos com:
- **Plano semanal de estudos gerado por IA**
- **Mentor virtual com IA generativa (Gemini)**
- **Notícias sobre futuro do trabalho e tecnologia**
- **Perfil com objetivo, horas disponíveis e área de interesse**

---

## 🚀 Tecnologias

- React Native (Expo, TypeScript)
- React Navigation (Stack + Bottom Tabs)
- Firebase Authentication
- Firebase Realtime Database
- API Google Gemini (IA generativa)
- @expo/vector-icons, @react-native-picker/picker

---

## 📱 Funcionalidades

- **Login / Cadastro**
  - Autenticação com e-mail e senha via Firebase Authentication.

- **Perfil**
  - Nome, objetivo de carreira, horas semanais de estudo, nível atual, estilo de aprendizado e área de interesse (IA, Front-end, Dados, etc.).
  - Edição e salvamento em tempo real no Firebase.

- **Mentor IA**
  - Tela em formato de chat (estilo WhatsApp).
  - Usuário envia dúvidas e a IA responde como um mentor de carreira.

- **Plano semanal**
  - Gera um plano de estudos para a semana com base no perfil do usuário.
  - Tarefas com título, descrição, tempo estimado e status (concluída/não concluída).
  - Dados salvos em `plans/{uid}/{weekId}` no Firebase.

- **Novidades**
  - Lista de notícias geradas por IA sobre futuro do trabalho e requalificação.
  - Botão de **“Resetar notícias”** para buscar novos conteúdos.

---

## ⚙️ Configuração do projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/SEU_USUARIO/SEU_REPO.git
cd SEU_REPO


RM DOS PARTICIPANTES:

RM94524 - Eduardo de Oliveira Nistal
RM94618 - Enzo Vazquez Sartorelli
