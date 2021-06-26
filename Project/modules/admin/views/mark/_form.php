<?php

use yii\helpers\Html;
use yii\widgets\ActiveForm;
use yii\helpers\ArrayHelper;

/* @var $this yii\web\View */
/* @var $model app\models\Mark */
/* @var $form yii\widgets\ActiveForm */


use app\models\Subject;

$subjectDrop = Subject::find()->asArray()->all();
$userDrop = Yii::$app->db->createCommand("SELECT user.id, user.username FROM `user`, `auth_assignment` WHERE `item_name`='student' AND `user`.`id` = `auth_assignment`.`user_id`")->queryAll();
?>

<div class="mark-form">

    <?php $form = ActiveForm::begin(); ?>

    <?= $form->field($model, 'subject_id')->dropDownList(
        ArrayHelper::map($subjectDrop, 'id', 'title')
    )->label("Предмет") ?>

    <?= $form->field($model, 'user_id')->dropDownList(
        ArrayHelper::map($userDrop, 'id', 'username')
    )->label("Ученик") ?>

    <?= $form->field($model, 'mark')->textInput(['maxlength' => true])->label("Оценка") ?>

    <div class="form-group">
        <?= Html::submitButton('Сохранить', ['class' => 'btn btn-success']) ?>
    </div>

    <?php ActiveForm::end(); ?>

</div>
