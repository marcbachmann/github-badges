# Github badges

### Example

The current milestone of facebook/react

<a href="https://github-badges.now.sh/facebook/react/milestones/current">![Current milestone](https://github-badges.now.sh/facebook/react/milestones/current.svg)</a>

The next milestone of facebook/react

<a href="https://github-badges.now.sh/facebook/react/milestones/next">![Next milestone](https://github-badges.now.sh/facebook/react/milestones/next.svg)</a>


### Use
```bash
npm install
GITHUB_TOKEN=YOUR_TOKEN node index.js

# To load some images
curl http://localhost:8080/owner/repo/milestones/current.svg
curl http://localhost:8080/owner/repo/milestones/next.svg
curl http://localhost:8080/owner/repo/milestones/2.svg # or query by index

# To redirect to the current milestone
curl http://localhost:8080/owner/repo/milestones/current
curl http://localhost:8080/owner/repo/milestones/next
```

