<?php

use yii\helpers\Html;
use yii\grid\GridView;
use mdm\admin\models\User;

/* @var $this yii\web\View */
/* @var $searchModel app\models\MarkSearch */
/* @var $dataProvider yii\data\ActiveDataProvider */

$this->title = 'Оценки';
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="mark-index">

    <h1><?= Html::encode($this->title) ?></h1>

    <p>
        <?= Html::a('Добавить оценку', ['create'], ['class' => 'btn btn-success']) ?>
    </p>

    <?php // echo $this->render('_search', ['model' => $searchModel]); ?>

    <?= GridView::widget([
        'dataProvider' => $dataProvider,
        'filterModel' => $searchModel,
        'columns' => [
            ['class' => 'yii\grid\SerialColumn'],

            ['attribute' => 'id', 'label' => 'id'],
            ['attribute' => 'subject_id', 'value' => 'subject.title', 'label' => 'Предмет'],
            ['attribute' => 'user_id', 'label' => 'Ученик', 'value' => function ($model) {
                $name = User::find()->where(['id' => $model->id])->one();
                return $name->username;
            }],
            ['attribute' => 'mark', 'label' => 'Оценка'],

            ['class' => 'yii\grid\ActionColumn'],
        ],
    ]); ?>


</div>
