<?php

namespace App\Controllers;

<<<<<<< HEAD
use App\Controllers\BaseController;
use App\Models\NotificationModel;
use App\Models\UserModel;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\HTTP\ResponseInterface;
=======
use App\Models\LikeModel;
use App\Models\NotificationModel;
use App\Models\PublicationModel;
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
    public function toggle($userId = null, $publicationId = null)
    {
        $likes = new LikeModel();
        $publications = new PublicationModel();
        $publication = $publications->find($publicationId);
        if (!$publication) {
            return $this->failNotFound('Publication non trouvée');
        }

        if ($likes->hasLiked($publicationId, $userId)) {
            $likes->where('publication_id', $publicationId)->where('utilisateur_id', $userId)->delete();
            $publications->decrementLikes($publicationId);
            $updated = $publications->find($publicationId);
            return $this->respond(['message' => 'Like retiré', 'action' => 'unlike', 'liked' => false, 'nombre_like_actuel' => (int) $updated['nombre_like']]);
        }

        $likes->insert(['publication_id' => $publicationId, 'utilisateur_id' => $userId, 'date' => date('Y-m-d H:i:s')]);
        $publications->incrementLikes($publicationId);
        if ((int) $publication['utilisateur_id'] !== (int) $userId) {
            (new NotificationModel())->createNotification([
                'auteur_id' => $userId,
                'utilisateur_id' => $publication['utilisateur_id'],
                'publication_id' => $publicationId,
                'type' => 'like',
            ]);
        }
        $updated = $publications->find($publicationId);
        return $this->respondCreated(['message' => 'Like ajouté', 'action' => 'like', 'liked' => true, 'nombre_like_actuel' => (int) $updated['nombre_like']]);
    }

    public function count($publicationId = null)
    {
        return $this->respond(['nombre_de_like' => (new LikeModel())->where('publication_id', $publicationId)->countAllResults()]);
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