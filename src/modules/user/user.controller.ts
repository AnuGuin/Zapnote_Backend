import { Request, Response, NextFunction } from 'express';
import * as userService from './user.service.js';
import { successResponse } from '../../utils/response.js';
import { NotFoundError } from '../../utils/error.js';


export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await userService.getUserById(req.userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    successResponse(res, user, 'User profile fetched successfully');
  } catch (error) {
    next(error);
  }
}


export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const { username, displayName } = req.body;

    const updatedUser = await userService.updateUserProfile(req.userId, {
      username,
      displayName,
    });

    successResponse(res, updatedUser, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
}


export async function getStats(req: Request, res: Response, next: NextFunction) {
  try {
    const stats = await userService.getUserStats(req.userId);
    successResponse(res, stats, 'User stats fetched successfully');
  } catch (error) {
    next(error);
  }
}


export async function getWorkspaces(req: Request, res: Response, next: NextFunction) {
  try {
    const workspaces = await userService.getUserWorkspaces(req.userId);
    successResponse(res, workspaces, 'Workspaces fetched successfully');
  } catch (error) {
    next(error);
  }
}

export async function deleteAccount(req: Request, res: Response, next: NextFunction) {
  try {
    await userService.deleteUser(req.userId);
    successResponse(res, null, 'Account deleted successfully');
  } catch (error) {
    next(error);
  }
}