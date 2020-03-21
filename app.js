const Joi = require("@hapi/joi");
const express = require("express");

const app = express();
const port = 3000;

app.use(express.json());

const issues = [
  {
    id: 1,
    name: "Course 1"
  },
  {
    id: 2,
    name: "Course 2"
  },
  {
    id: 3,
    name: "Course 3"
  }
];

app.get("/api", (req, res) => res.send("Welcome to the home page"));

// get all issues
app.get("/api/issues", (req, res) => {
  res.send(issues);
});

// get one issue
app.get("/api/issues/:id", (req, res) => {
  const issue = issues.find(i => i.id === parseInt(req.params.id));

  if (!issue) return res.status(404).send("Issue not found"); // 404 not found

  res.send(issue);
});

// create a new issue
app.post("/api/issues", (req, res) => {
  // validate
  const { error } = validateIssue(req.body.name);

  // if invalid, 400
  if (error) {
    res.status(400).send(error.details[0].message); //bad request
    return;
  }

  const issue = {
    id: issues.length + 1,
    name: req.body.name
  };
  issues.push(issue);
  res.send(issue);
});

// update an issue
app.put("/api/issues/:id", (req, res) => {
  // look up the issue
  const issue = issues.find(i => i.id === parseInt(req.params.id));
  // if it doesn't exist, 404
  if (!issue) return res.status(404).send("Issue not found"); // 404 not found

  // validate
  const { error } = validateIssue(req.body.name);

  // if invalid, 400
  if (error) {
    res.status(400).send(error.details[0].message); //bad request
    return;
  }

  // update issue
  issue.name = req.body.name;
  // return the updated issue
  res.send(issue);
});

// delete an issue
app.delete("/api/issues/:id", (req, res) => {
  const issue = issues.find(i => i.id === parseInt(req.params.id));
  if (!issue) return res.status(404).send("Issue not found");

  const index = issues.indexOf(issue);
  issues.splice(index, 1);

  res.send(`Issue has been deleted`);
});

// validate input
function validateIssue(issueName) {
  const schema = new Joi.object({
    name: Joi.string()
      .min(3)
      .required()
  });

  return schema.validate({ name: issueName });
}

app.listen(port, () => console.log(`Listening on port ${port}`));
