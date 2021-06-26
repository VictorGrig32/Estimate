<?php

use yii\helpers\Html;
use yii\helpers\ArrayHelper;
use yii\widgets\ActiveForm;

/* @var $this yii\web\View */
/* @var $model mdm\admin\models\User */
/* @var $form yii\widgets\ActiveForm */

$this->title ='Аккаунт';
$this->params['breadcrumbs'][] = $this->title;
?>

<h1><?= Html::encode($this->title) ?></h1>

<div class="materials-form">

    <?php $form = ActiveForm::begin(['action' => '/account/edit']) ?>

    <?= $form->field($model, 'username')->textInput()->label('Имя пользователя') ?>
    <?= $form->field($model, 'email')->textInput()->label('Email') ?>
    <?= $form->field($model, 'fullname')->textInput()->label('ФИО') ?>
    <?= $form->field($model, 'password_hash')->textInput(['value' => ''])->label('Новый пароль <small class="text-muted">необязательно</small>') ?>

    <div class="form-group">
        <?= Html::submitButton('Изменить', ['class' => 'btn btn-success']) ?>
    </div>

    <?php ActiveForm::end(); ?>

</div>
