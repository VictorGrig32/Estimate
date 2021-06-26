<?php

/* @var $this yii\web\View */

use yii\helpers\Html;

$this->title = 'О нас';
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="site-about">
    <h1><?= Html::encode($this->title) ?></h1>

    <p>
        Веб-приложение учёта оценок за проходимые предметы
    </p>

    <a href="/web/task.html">ТЗ</a>
</div>
