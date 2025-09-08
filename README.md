<h1>What to do</h1>
This is a simple todo task website for BDI application by Nathanon Akkaraphab

### Architecture

- Backend: python 3.10 and FastAPI 0.116.1
- Frontend: React, built with npm/Vite
- Database: Mongodb
- dockerized based on docker compose

### Installation and usage

```bash
git clone https://github.com/nathanon-akk/whattodo.git
cd whattodo
docker compose up
# Open browser and enter http://localhost:3000
```

### Comment

This repo is highly based on https://github.com/EASS-HIT-PART-A-2022-CLASS-II/Todo-App.<br/>
The frontend is, however, almost completely rewritten.<br/>
My decision is to go for due dates and Dockerizing from the start.<br/>
I hope to implement signup and login with JWT, but got confused by JWT auth documentation page.<br/>
Ant Design is used for frontend design library because of familiarity.<br/>
Unfortunately, I'm not too comfortable with writing unit test, especially with no experience with Mongodb.<br/>
No generative AI was used for creation of this repo, personally.
