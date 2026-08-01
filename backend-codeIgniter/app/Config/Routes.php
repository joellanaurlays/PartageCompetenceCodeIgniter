<?php

namespace Config;

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