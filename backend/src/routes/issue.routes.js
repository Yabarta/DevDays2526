import { Router } from "express";
import { getAllIssues, getIssueByIssueId, fetchGithubIssues } from "../controllers/issue.controller.js";

const issueRouter = Router();

issueRouter.get('/issues', getAllIssues);
issueRouter.get('/issues/:issueId', getIssueByIssueId);
issueRouter.post('/issues/fetch', fetchGithubIssues);

export { issueRouter };