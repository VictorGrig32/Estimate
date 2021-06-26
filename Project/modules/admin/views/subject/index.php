<?php

use yii\helpers\Html;
use yii\grid\GridView;
use mdm\admin\models\User;

/* @var $this yii\web\View */
/* @var $searchModel app\models\SubjectSearch */
/* @var $dataProvider yii\data\ActiveDataProvider */

$this->title = 'Предметы';
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="subject-index">

    <h1><?= Html::encode($this->title) ?></h1>

    <p>
        <?= Html::a('Добавить предмет', ['create'], ['class' => 'btn btn-success']) ?>
    </p>

    <?php // echo $this->render('_search', ['model' => $searchModel]); ?>

    <?= GridView::widget([
        'dataProvider' => $dataProvider,
        'filterModel' => $searchModel,
        'columns' => [
            ['class' => 'yii\grid\SerialColumn'],

            ['attribute' => 'id', 'label' => 'id'],
            ['attribute' => 'title', 'label' => 'Название'],
            ['attribute' => 'teacher_id', 'label' => 'Преподаватель', 'value' => function ($model) {
                $name = User::find()->where(['id' => $model->id])->one();
                return $name->username;
            }],

            ['class' => 'yii\grid\ActionColumn'],
        ],
    ]); ?>


</div>
