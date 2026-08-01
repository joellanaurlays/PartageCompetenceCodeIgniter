<?php

namespace App\Controllers;

use App\Models\UserModel;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\HTTP\ResponseInterface;

class UserController extends BaseController
{
    use ResponseTrait;

    protected $userModel;

    public function __construct()
    {
        $this->userModel = new UserModel();
    }

    // GET /api/users
    public function index()
    {
        $users = $this->userModel->findAll();
        return $this->respond($users);
    }

    // GET /api/users/{id}
    public function show($id = null)
    {
        if ($id === null) {
            return $this->failValidationErrors('ID utilisateur requis');
        }

        $user = $this->userModel->find($id);
        if ($user === null) {
            return $this->failNotFound('Utilisateur non trouvé');
        }

        // Ne pas retourner le mot de passe
        unset($user['mot_de_passe']);
        return $this->respond($user);
    }

    public function register()
    {
        $data = $this->request->getJSON(true);
        
        if (!$this->userModel->save($data)) {
            return $this->failValidationErrors($this->userModel->errors());
        }

        $id = (int) $this->userModel->getInsertID();
        $user = $this->userModel->find($id);
        return $this->respondCreated([
            'message' => 'Inscription réussie',
            'utilisateurId' => $id,
            'pseudo' => $user['pseudo'],
            'email' => $user['email'],
            'photo_profil' => $user['photo_profil'],
        ]);
    }

    // PUT /api/users/{id}
    public function update($id = null)
    {
        if ($id === null) {
            return $this->failValidationErrors('ID utilisateur requis');
        }

        $data = $this->request->getJSON(true) ?? [];
        $data['id'] = $id;

        if (!$this->userModel->save($data)) {
            return $this->failValidationErrors($this->userModel->errors());
        }

        $user = $this->userModel->find($id);
        unset($user['mot_de_passe']);
        
        return $this->respond($user);
    }

    // DELETE /api/users/{id}
    public function delete($id = null)
    {
        if ($id === null) {
            return $this->failValidationErrors('ID utilisateur requis');
        }

        if (!$this->userModel->find($id)) {
            return $this->failNotFound('Utilisateur non trouvé');
        }

        $this->userModel->delete($id);
        return $this->respondDeleted(['message' => 'Utilisateur supprimé avec succès']);
    }

    // GET /api/users/{id}/publications
    public function getPublications($id = null)
    {
        if ($id === null) {
            return $this->failValidationErrors('ID utilisateur requis');
        }

        $publications = $this->userModel->getPublications($id);
        return $this->respond($publications);
    }

    // GET /api/users/{id}/notifications
    public function getNotifications($id = null)
    {
        if ($id === null) {
            return $this->failValidationErrors('ID utilisateur requis');
        }

        $notifications = $this->userModel->getNotifications($id);
        return $this->respond($notifications);
    }

    // POST /api/login
    public function login()
    {
        $data = $this->request->getJSON(true);
        
        $email = $data['email'] ?? null;
        $password = $data['mot_de_passe'] ?? null;

        if (!$email || !$password) {
            return $this->failValidationErrors('Email et mot de passe requis');
        }

        $user = $this->userModel->where('email', $email)->first();

        if (!$user || !password_verify($password, $user['mot_de_passe'])) {
            return $this->failUnauthorized('Identifiants invalides');
        }

        return $this->respond([
            'message' => 'Connexion réussie',
            'utilisateurId' => (int) $user['id'],
            'pseudo' => $user['pseudo'],
            'email' => $user['email'],
            'photo_profil' => $user['photo_profil'],
        ]);
    }

    public function logout()
    {
        return $this->respond(['message' => 'Déconnexion réussie']);
    }

    public function updatePhoto($id = null)
    {
        if ($id === null || !$this->userModel->find($id)) {
            return $this->failNotFound('Utilisateur non trouvé');
        }

        $photo = $this->request->getFile('photo_profil');
        if ($photo === null || !$photo->isValid()) {
            return $this->failValidationErrors('Une image de profil valide est requise');
        }

        $name = $photo->getRandomName();
        if (!is_dir(FCPATH . 'uploads/profils')) {
            mkdir(FCPATH . 'uploads/profils', 0775, true);
        }
        $photo->move(FCPATH . 'uploads/profils', $name);
        $path = '/uploads/profils/' . $name;
        $this->userModel->update($id, ['photo_profil' => $path]);

        return $this->respond(['message' => 'Photo de profil modifiée', 'photo_profil' => $path]);
    }

    public function changePassword()
    {
        $data = $this->request->getJSON(true) ?? [];
        $email = $data['email'] ?? '';
        $password = $data['nouveauMotDePasse'] ?? '';
        if ($password === '' || $password !== ($data['confirmationMotDePasse'] ?? null)) {
            return $this->failValidationErrors('Les mots de passe ne correspondent pas');
        }
        if (strlen($password) < 8) {
            return $this->failValidationErrors('Le mot de passe doit contenir au moins 8 caractères');
        }
        $user = $this->userModel->where('email', $email)->first();
        if (!$user) {
            return $this->failNotFound('Utilisateur non trouvé');
        }
        $this->userModel->update($user['id'], ['mot_de_passe' => $password]);
        return $this->respond(['message' => 'Mot de passe modifié avec succès']);
    }
}
