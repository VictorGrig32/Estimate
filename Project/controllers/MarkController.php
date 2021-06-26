<?

namespace app\controllers;

use Yii;
use yii\web\Controller;
use app\models\Mark;

class MarkController extends Controller {
    public function actionIndex() {
        // select * from `mark` as m join `user` as u on u.ID = m.user_id join `subject` as s on s.ID = m.subject_id  WHERE m.`user_id` = 4
        // $model = Mark::find()->where(['user_id' => Yii::$app->user->id])->all();
        $model = Yii::$app->db->createCommand("select title, mark from `mark` as m join `user` as u on u.ID = m.user_id join `subject` as s on s.ID = m.subject_id WHERE m.`user_id` = " . Yii::$app->user->id)->queryAll();

        return $this->render('index', ['model' => $model]);
    }
}