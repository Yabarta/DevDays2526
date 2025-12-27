import issueService from '../services/issue.service.js';

export const getAllIssues = async (req, res) => {
    try {
        const issues = await issueService.getAllIssues();
        res.status(200).json(issues);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getIssueByIssueId = async (req, res) => {
    const issueId = req.params.issueId;
    try {
        const issue = await issueService.getIssueByIssueId(issueId);
        if (!issue) {
            return res.status(404).json({ message: 'Issue not found' });
        }
        res.status(200).json(issue);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const fetchGithubIssues = async (req, res) => {
    const repoOwner = req.body.repository.owner;
    const repoName = req.body.repository.name;
    try {
        const githubIssues = await issueService.fetchGithubIssues(repoOwner, repoName);
        const savedIssues = await issueService.saveIssues(githubIssues);
        res.status(200).json(savedIssues);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};