fetch("http://localhost:4000/api/ai/analyze", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    repo_id: 12345,
    name: "test-repo",
    owner: "test-owner",
    description: "A test repo",
    language: "JavaScript",
    stars: 15000,
    forks: 200,
    topics: ["test"],
    openIssues: 10
  })
}).then(res => res.json()).then(console.log).catch(console.error);
