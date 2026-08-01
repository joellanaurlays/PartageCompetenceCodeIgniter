<?php

namespace Config;

<<<<<<< HEAD
// Create a new instance of our RouteCollection class.
$routes = Services::routes();

// Load the system's routing file first, so that the app and ENVIRONMENT
// can override as needed.
if (file_exists(SYSTEMPATH . 'Config/Routes.php')) {
    require SYSTEMPATH . 'Config/Routes.php';
}

$routes->setDefaultNamespace('App\Controllers');
$routes->setDefaultController('Home');
$routes->setDefaultMethod('index');
$routes->setTranslateURIDashes(false);
$routes->set404Override();

// API Routes
$routes->group('api', ['namespace' => 'App\Controllers'], function($routes) {
    // Routes Utilisateur
    $routes->post('register', 'UserController::register');
    $routes->post('login', 'UserController::login');
    $routes->get('users', 'UserController::index');
    $routes->get('users/(:num)', 'UserController::show/$1');
    $routes->put('users/(:num)', 'UserController::update/$1');
    $routes->delete('users/(:num)', 'UserController::delete/$1');
    $routes->get('users/(:num)/publications', 'UserController::getPublications/$1');

    // Routes Publication
    $routes->get('publications', 'PublicationController::index');
    $routes->get('publications/(:num)', 'PublicationController::show/$1');
    $routes->post('publications', 'PublicationController::create');
    $routes->put('publications/(:num)', 'PublicationController::update/$1');
    $routes->delete('publications/(:num)', 'PublicationController::delete/$1');
    $routes->get('publications/user/(:num)', 'PublicationController::getByUser/$1');

    // Routes Commentaire
    $routes->get('publications/(:num)/commentaires', 'CommentaireController::getByPublication/$1');
    $routes->post('commentaires', 'CommentaireController::create');
    $routes->put('commentaires/(:num)', 'CommentaireController::update/$1');
    $routes->delete('commentaires/(:num)', 'CommentaireController::delete/$1');
    $routes->get('commentaires/(:num)/reponses', 'CommentaireController::getReplies/$1');

    // Routes Like
    $routes->post('publications/(:num)/like', 'LikeController::toggle/$1');
    $routes->get('publications/(:num)/likes/count', 'LikeController::count/$1');
    $routes->get('users/(:num)/likes', 'LikeController::getUserLikes/$1');

    // Routes Notification
    $routes->get('users/(:num)/notifications', 'NotificationController::index/$1');
    $routes->get('users/(:num)/notifications/unread', 'NotificationController::getUnread/$1');
    $routes->put('notifications/(:num)/read', 'NotificationController::markAsRead/$1');
    $routes->put('users/(:num)/notifications/read-all', 'NotificationController::markAllAsRead/$1');
});

// Accueil
$routes->get('/', 'Home::index');
=======
/** @var RouteCollection $routes */
$routes->get('/', 'Home::index');

$routes->group('api', static function ($routes) {
    $routes->post('utilisateurs/inscription', 'UserController::register');
    $routes->post('utilisateurs/connexion', 'UserController::login');
    $routes->post('utilisateurs/deconnexion', 'UserController::logout');
    $routes->put('utilisateurs/(:num)', 'UserController::update/$1');
    $routes->put('utilisateurs/(:num)/photo', 'UserController::updatePhoto/$1');
    $routes->post('utilisateurs/modifier-mot-de-passe', 'UserController::changePassword');
    $routes->delete('utilisateurs/(:num)', 'UserController::delete/$1');

    $routes->get('publications/toutes', 'PublicationController::index');
    $routes->get('publications/utilisateur/(:num)', 'PublicationController::byUser/$1');
    $routes->post('publications/creer/(:num)', 'PublicationController::createForUser/$1');
    $routes->put('publications/(:num)', 'PublicationController::update/$1');
    $routes->delete('publications/(:num)', 'PublicationController::delete/$1');

    $routes->post('likes/(:num)/(:num)', 'LikeController::toggle/$1/$2');
    $routes->get('likes/(:num)', 'LikeController::count/$1');

    $routes->get('commentaires/(:num)', 'CommentaireController::byPublication/$1');
    $routes->get('commentaires/nombre/(:num)', 'CommentaireController::count/$1');
    $routes->post('commentaires/(:num)/(:num)', 'CommentaireController::create/$1/$2');
    $routes->put('commentaires/(:num)', 'CommentaireController::update/$1');
    $routes->delete('commentaires/(:num)', 'CommentaireController::delete/$1');

    $routes->get('notifications', 'NotificationController::index');
    $routes->get('notifications/non-lu/count', 'NotificationController::unreadCount');
    $routes->put('notifications/(:num)/lu', 'NotificationController::markRead/$1');
    $routes->put('notifications/lu/tout', 'NotificationController::markAllRead');
});
>>>>>>> 002bc163ab0885299ac994c5f3c456ba77cfe474
