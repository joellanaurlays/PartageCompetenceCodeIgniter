<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateLikesTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
                'auto_increment' => true,
            ],
            'date' => [
                'type' => 'DATETIME',
            ],
            'publication_id' => [
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true,
            ],
            'utilisateur_id' => [
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true,
            ],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addUniqueKey(['publication_id', 'utilisateur_id']); // RG4: Un like par utilisateur par publication
        $this->forge->addForeignKey('publication_id', 'publications', 'id', 'CASCADE', 'CASCADE');
        $this->forge->addForeignKey('utilisateur_id', 'utilisateurs', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('likes');
    }

    public function down()
    {
        $this->forge->dropTable('likes');
    }
}