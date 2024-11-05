import { followUser } from '../models/followModel.mjs';

export const followAnotherUser = async (req, res) => {
    const { userId } = req.params;
    try {
        if (!userId) {
            return res.status(400).json({ status_code: 400, message: 'User ID is required' });
        }
        await followUser(req.user.id, userId);
        res.status(200).json({ status_code: 200, message: 'User followed successfully' });
    } catch (error) {
        res.status(500).json({ status_code: 500, message: error.message });
    }
};
