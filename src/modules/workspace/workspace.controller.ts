import { Request, Response, NextFunction } from 'express';
import * as workspaceService from './workspace.service.js';
import { successResponse } from '../../utils/response.js';


export async function createWorkspace(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, description } = req.body;
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    
    const workspace = await workspaceService.createWorkspace(userId, {
      name,
      description,
    });

    successResponse(res, workspace, 'Workspace created successfully', 201);
  } catch (error) {
    next(error);
  }
}


export async function getWorkspace(req: Request, res: Response, next: NextFunction) {
  try {
    const { workspaceId } = req.params;
    const userId = req.userId;
    
    if (!workspaceId || !userId) {
      return res.status(400).json({ success: false, message: 'Missing required parameters' });
    }
    
    const workspace = await workspaceService.getWorkspaceById(workspaceId, userId);

    successResponse(res, workspace, 'Workspace fetched successfully');
  } catch (error) {
    next(error);
  }
}


export async function updateWorkspace(req: Request, res: Response, next: NextFunction) {
  try {
    const { workspaceId } = req.params;
    const { name, description } = req.body;
    
    if (!workspaceId) {
      return res.status(400).json({ success: false, message: 'Missing workspace ID' });
    }

    const updated = await workspaceService.updateWorkspace(workspaceId, {
      name,
      description,
    });

    successResponse(res, updated, 'Workspace updated successfully');
  } catch (error) {
    next(error);
  }
}


export async function deleteWorkspace(req: Request, res: Response, next: NextFunction) {
  try {
    const { workspaceId } = req.params;
    
    if (!workspaceId) {
      return res.status(400).json({ success: false, message: 'Missing workspace ID' });
    }
    
    await workspaceService.deleteWorkspace(workspaceId);

    successResponse(res, null, 'Workspace deleted successfully');
  } catch (error) {
    next(error);
  }
}


export async function getMembers(req: Request, res: Response, next: NextFunction) {
  try {
    const { workspaceId } = req.params;
    
    if (!workspaceId) {
      return res.status(400).json({ success: false, message: 'Missing workspace ID' });
    }
    
    const members = await workspaceService.getWorkspaceMembers(workspaceId);

    successResponse(res, members, 'Members fetched successfully');
  } catch (error) {
    next(error);
  }
}


export async function addMember(req: Request, res: Response, next: NextFunction) {
  try {
    const { workspaceId } = req.params;
    const { email, role } = req.body;
    
    if (!workspaceId) {
      return res.status(400).json({ success: false, message: 'Missing workspace ID' });
    }

    const member = await workspaceService.addWorkspaceMember(workspaceId, email, role);

    successResponse(res, member, 'Member added successfully', 201);
  } catch (error) {
    next(error);
  }
}


export async function updateMemberRole(req: Request, res: Response, next: NextFunction) {
  try {
    const { workspaceId, memberId } = req.params;
    const { role } = req.body;
    
    if (!workspaceId || !memberId) {
      return res.status(400).json({ success: false, message: 'Missing required parameters' });
    }

    const updated = await workspaceService.updateMemberRole(workspaceId, memberId, role);

    successResponse(res, updated, 'Member role updated successfully');
  } catch (error) {
    next(error);
  }
}


export async function removeMember(req: Request, res: Response, next: NextFunction) {
  try {
    const { workspaceId, memberId } = req.params;
    
    if (!workspaceId || !memberId) {
      return res.status(400).json({ success: false, message: 'Missing required parameters' });
    }
    
    await workspaceService.removeMember(workspaceId, memberId);

    successResponse(res, null, 'Member removed successfully');
  } catch (error) {
    next(error);
  }
}


export async function leaveWorkspace(req: Request, res: Response, next: NextFunction) {
  try {
    const { workspaceId } = req.params;
    const userId = req.userId;
    
    if (!workspaceId || !userId) {
      return res.status(400).json({ success: false, message: 'Missing required parameters' });
    }
    
    await workspaceService.leaveWorkspace(workspaceId, userId);

    successResponse(res, null, 'Left workspace successfully');
  } catch (error) {
    next(error);
  }
}