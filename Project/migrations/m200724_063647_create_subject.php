<?php

use yii\db\Migration;

/**
 * Class m200724_063647_create_subject
 */
class m200724_063647_create_subject extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('subject', [
            'id' => $this->primaryKey(),
            'title' => $this->string(),
            'teacher_id' => $this->integer(),
        ]);

        // $this->addForeignKey(
        //     'FK_teacher_id',  // это "условное имя" ключа
        //     'subject', // это название текущей таблицы
        //     'teacher_id', // это имя поля в текущей таблице, которое будет ключом
        //     'user', // это имя таблицы, с которой хотим связаться
        //     'id', // это поле таблицы, с которым хотим связаться
        //     'CASCADE' // что делать при удалении сущности, на которую ссылаемся
        // );
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        echo "m200724_063647_create_subject cannot be reverted.\n";

        return false;
    }

    /*
    // Use up()/down() to run migration code without a transaction.
    public function up()
    {

    }

    public function down()
    {
        echo "m200724_063647_create_subject cannot be reverted.\n";

        return false;
    }
    */
}
