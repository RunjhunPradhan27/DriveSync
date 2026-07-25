# ARCHITECTURE.md

Project Structure

DriveSync/

client/

server/

database/

docs/

---

Client

src/

assets/

components/

pages/

layouts/

hooks/

context/

services/

utils/

---

Server

src/

config/

controllers/

models/

routes/

middlewares/

validators/

utils/

app.js

server.js

---

Database

schema.sql

seeds.sql

migrations/

---

Coding Style

Use MVC.

Use REST APIs.

Use modular architecture.

Use clean folder separation.

Follow single responsibility principle.

Never place business logic inside routes.

Controllers call Models.

Models interact with MySQL.

Frontend communicates only through API services.