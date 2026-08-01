<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\NotificationModel;
use App\Models\UserModel;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\HTTP\ResponseInterface;

class NotificationController extends BaseController
{
    use ResponseTrait;

    protected $notificationModel;
    protected $userModel;

    public function __construct()
    {
        $this->notificationModel = new NotificationModel();
        $this->userModel = new UserModel();
    }

    /**
     * GET /api/users/{id}/notifications
     */
    public function index($userId = null)
    {
        if ($userId === null) {
            return $this->failValidationErrors('ID utilisateur requis');
        }

        $user = $this->userModel->find($userId);
        if ($user === null) {
            return $this->failNotFound('Utilisateur non trouvé');
        }

        $notifications = $this->notificationModel->getNotificationsWithAuteur($userId);
        return $this->respond($notifications);
    }

    /**
     * GET /api/users/{id}/notifications/unread
     */
    public function getUnread($userId = null)
    {
        if ($userId === null) {
            return $this->failValidationErrors('ID utilisateur requis');
        }

        $user = $this->userModel->find($userId);
        if ($user === null) {
            return $this->failNotFound('Utilisateur non trouvé');
        }

        $notifications = $this->notificationModel->getUnread($userId);
        return $this->respond($notifications);
    }

    /**
     * PUT /api/notifications/{id}/read
     */
    public function markAsRead($notificationId = null)
    {
        if ($notificationId === null) {
            return $this->failValidationErrors('ID notification requis');
        }

        $notification = $this->notificationModel->find($notificationId);
        if (!$notification) {
            return $this->failNotFound('Notification non trouvée');
        }

        $this->notificationModel->markAsRead($notificationId);
        return $this->respond(['message' => 'Notification marquée comme lue']);
    }

    /**
     * PUT /api/users/{id}/notifications/read-all
     */
    public function markAllAsRead($userId = null)
    {
        if ($userId === null) {
            return $this->failValidationErrors('ID utilisateur requis');
        }

        $user = $this->userModel->find($userId);
        if ($user === null) {
            return $this->failNotFound('Utilisateur non trouvé');
        }

        $this->notificationModel->markAllAsRead($userId);
        return $this->respond(['message' => 'Toutes les notifications marquées comme lues']);
    }
}