<?php

use yii\helpers\Html;
use yii\widgets\DetailView;
use app\models\Subject;
use mdm\admin\models\User;

/* @var $this yii\web\View */
/* @var $model app\models\Mark */

$this->title = Subject::find()->where(['id' => $model->id])->one()->title;
$this->params['breadcrumbs'][] = ['label' => 'Оценки', 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;
\yii\web\YiiAsset::register($this);
?>
<div class="mark-view">

    <h1><?= Html::encode($this->title) ?></h1>

    <p>
        <?= Html::a('Изменить', ['update', 'id' => $model->id], ['class' => 'btn btn-primary']) ?>
        <?= Html::a('Удалить', ['delete', 'id' => $model->id], [
            'class' => 'btn btn-danger',
            'data' => [
                'confirm' => 'Точно удалить?',
                'method' => 'post',
            ],
        ]) ?>
    </p>

    <?= DetailView::widget([
        'model' => $model,
        'attributes' => [
            ['attribute' => 'id', 'label' => 'id'],
            ['attribute' => 'subject_id', 'label' => 'Предмет', 'value' => function ($model) {
                $name = Subject::find()->where(['id' => $model->id])->one();
                return $name->title;
            }],
            ['attribute' => 'user_id', 'label' => 'Ученик', 'value' => function ($model) {
                $name = User::find()->where(['id' => $model->id])->one();
                return $name->username;
            }],
            ['attribute' => 'mark', 'label' => 'Оценка'],
        ],
    ]) ?>

</div>
