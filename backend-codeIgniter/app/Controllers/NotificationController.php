<?php

namespace App\Controllers;

use App\Models\NotificationModel;
use CodeIgniter\API\ResponseTrait;

class NotificationController extends BaseController
{
    use ResponseTrait;

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
    }
}
