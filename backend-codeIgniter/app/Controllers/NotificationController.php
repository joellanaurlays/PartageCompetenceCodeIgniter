<?php

namespace App\Controllers;

<<<<<<< HEAD
use App\Controllers\BaseController;
use App\Models\NotificationModel;
use App\Models\UserModel;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\HTTP\ResponseInterface;
=======
use App\Models\NotificationModel;
use CodeIgniter\API\ResponseTrait;
>>>>>>> 002bc163ab0885299ac994c5f3c456ba77cfe474

class NotificationController extends BaseController
{
    use ResponseTrait;

<<<<<<< HEAD
    protected $notificationModel;
    protected $userModel;

    public function __construct()
    {
        $this->notificationModel = new NotificationModel();
        $this->userModel = new UserModel();
=======
    private function userId(): ?int
    {
        $id = $this->request->getGet('utilisateur_id');
        return $id !== null && ctype_digit((string) $id) ? (int) $id : null;
    }

    public function index()
    {
        $userId = $this->userId();
        if ($userId === null) return $this->failValidationErrors('ID utilisateur requis');
        $rows = (new NotificationModel())->getNotificationsWithAuteur($userId);
        $notifications = array_map(static fn (array $row): array => [
            'id' => (int) $row['id'],
            'type' => $row['type'],
            'message' => $row['auteur_pseudo'] . ' a ' . ($row['type'] === 'like' ? 'aimé votre publication' : 'commenté votre publication'),
            'date' => $row['date'],
            'lu' => (bool) $row['lu'],
            'publicationId' => (int) $row['publication_id'],
            'auteurId' => (int) $row['auteur_id'],
            'pseudo' => $row['auteur_pseudo'],
            'photo_profil' => $row['auteur_photo'],
        ], $rows);
        return $this->respond($notifications);
    }

    public function unreadCount()
    {
        $userId = $this->userId();
        if ($userId === null) return $this->failValidationErrors('ID utilisateur requis');
        return $this->respond(['count' => (new NotificationModel())->where('utilisateur_id', $userId)->where('lu', false)->countAllResults()]);
    }

    public function markRead($id = null)
    {
        $model = new NotificationModel();
        if (!$model->find($id)) return $this->failNotFound('Notification non trouvée');
        $model->markAsRead($id);
        return $this->respond(['message' => 'Notification marquée comme lue']);
    }

    public function markAllRead()
    {
        $userId = $this->userId();
        if ($userId === null) return $this->failValidationErrors('ID utilisateur requis');
        (new NotificationModel())->markAllAsRead($userId);
        return $this->respond(['message' => 'Notifications marquées comme lues']);
>>>>>>> 002bc163ab0885299ac994c5f3c456ba77cfe474
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

        $notifications = $this->notificationModel->getNotificationsByUser($userId);
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

        $notifications = $this->notificationModel->getUnreadNotifications($userId);
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