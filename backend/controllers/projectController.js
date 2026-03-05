import Project from '../models/Project.js';

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
export const createProject = async (req, res) => {
  const { name, data } = req.body;

  const project = new Project({
    user: req.user._id,
    name,
    data,
  });

  const createdProject = await project.save();
  res.status(201).json(createdProject);
};

// @desc    Get user projects
// @route   GET /api/projects
// @access  Private
export const getProjects = async (req, res) => {
  const projects = await Project.find({ user: req.user._id });
  res.json(projects);
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
export const getProjectById = async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (project) {
    if (project.user.toString() !== req.user._id.toString()) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }
    res.json(project);
  } else {
    res.status(404).json({ message: 'Project not found' });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
export const updateProject = async (req, res) => {
  const { name, data } = req.body;

  const project = await Project.findById(req.params.id);

  if (project) {
    if (project.user.toString() !== req.user._id.toString()) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    project.name = name || project.name;
    project.data = data || project.data;

    const updatedProject = await project.save();
    res.json(updatedProject);
  } else {
    res.status(404).json({ message: 'Project not found' });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
export const deleteProject = async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (project) {
    if (project.user.toString() !== req.user._id.toString()) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    await Project.deleteOne({ _id: project._id });
    res.json({ message: 'Project removed' });
  } else {
    res.status(404).json({ message: 'Project not found' });
  }
};
