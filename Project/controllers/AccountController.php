<?

namespace app\controllers;

use Yii;
use yii\web\Controller;
use mdm\admin\models\User;

class AccountController extends Controller {
    public function actionIndex() {
        $model = User::find()->where(['id' => Yii::$app->user->id])->one();

        return $this->render('index', ['model' => $model]);
    }

    public function actionEdit(){

        $model = User::findOne(Yii::$app->user->id);
        
        $postData = Yii::$app->request->post();

        if ($postData) {
            
            $model->username = $postData["User"]['username'];
            $model->fullname = $postData["User"]['fullname'];
            //$2y$13$k9XRhquQgQ9r8BXSmA/BB.ndp19Y11XxMpGBxyqKrffqEA8L35EZ2
            if($model->password_hash!=""){
                $model->password_hash = Yii::$app->getSecurity()->generatePasswordHash($postData["User"]['password_hash']);
            }
            $model->email = $postData["User"]['email'];

            $model->save();
        }

        return $this->render('index', ['model' => $model]);
        // var_dump($postData); die;
    }
}