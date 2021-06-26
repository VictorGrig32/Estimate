<?php

use yii\db\Migration;

/**
 * Class m200724_063205_create_mark
 */
class m200724_063205_create_mark extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('mark', [
            'id' => $this->primaryKey(),
            'subject_id' => $this->integer(),
            'user_id' => $this->integer(),
            'mark' => $this->string()
        ]);

        $this->addForeignKey(
            'FK_subject_id',  // это "условное имя" ключа
            'mark', // это название текущей таблицы
            'subject_id', // это имя поля в текущей таблице, которое будет ключом
            'subject', // это имя таблицы, с которой хотим связаться
            'id', // это поле таблицы, с которым хотим связаться
            'CASCADE' // что делать при удалении сущности, на которую ссылаемся
        );

        // $this->addForeignKey(
        //     'FK_user_id',  // это "условное имя" ключа
        //     'mark', // это название текущей таблицы
        //     'user_id', // это имя поля в текущей таблице, которое будет ключом
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
        $this->dropTable('mark');

        //Добавляем удаление внешнего ключа
        $this->dropForeignKey(
            'FK_subject_id',
            'subject'
        );

        // //Добавляем удаление внешнего ключа
        // $this->dropForeignKey(
        //     'FK_user_id',
        //     'user'
        // );

        return false;
    }

    /*
    // Use up()/down() to run migration code without a transaction.
    public function up()
    {

    }

    public function down()
    {
        echo "m200724_063205_create_mark cannot be reverted.\n";

        return false;
    }
    */
}
