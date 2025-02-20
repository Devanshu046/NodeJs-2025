const express = require("express");
const users = require("./MOCK_DATA.json");
const fs = require("fs");
const app = express();
const PORT = 8000;

app.use(express.urlencoded({extended: false}))
//ROUTES
app.get("/users", (req, res) => {
  const html = `
    <ul>
    ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
    </ul>
    `;
  res.send(html);
});

// REST API END POINTS
app.get("/api/users", (req, res) => {
  return res.json(users);
});

app
  .route("/api/users/:id")
  .get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    return res.json(user);
  })
  .patch((req, res) => {
    const userIndex = users.findIndex((user) => user.id === Number(req.params.id));
    users[userIndex] = { ...users[userIndex], ...req.body };
    // TODO Update The User With id
    fs.writeFile('./MOCK_DATA.json',JSON.stringify(users),(err ,data)=>{
      return res.json({ status: "sucess",id: Number(req.params.id) });
    })
  })
  .delete((req, res) => {
    const id = Number(req.params.id);
    const userIndex = users.findIndex((user) => user.id === id);
    users.splice(userIndex,1);
    // TODO Delete The User With id
    fs.writeFile('./MOCK_DATA.json',JSON.stringify(users),(err ,data)=>{
      return res.json({ status: "sucess",id:id});
    })
   
  });

app.post("/api/users", (req, res) => {
  const body = req.body;
  users.push({...body,id: users.length+1});
  fs.writeFile('./MOCK_DATA.json',JSON.stringify(users),(err ,data)=>{
    return res.json({ status: "success",id: users.length });
  })
});

app.listen(PORT, () => console.log(`Server started at PORT ${PORT}`));
