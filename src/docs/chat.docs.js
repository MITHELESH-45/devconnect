/**
 * @swagger
 * /chat/{targetUserId}:
 *   get:
 *     summary: Get chat history with a specific user
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: targetUserId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to get chat with
 *     responses:
 *       200:
 *         description: Chat history fetched successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: No accepted connection found with this user
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
