const router = require('express').Router();
const axios = require('axios').default;
const WebhookResponse = require('@jambonz/node-client').WebhookResponse;

router.post('/', (req, res) => {
  console.log({payload: req.body}, 'POST /dial');
  try {
    const app = new WebhookResponse();
    app
      .play({
        url: 'silence_stream://500',
        earlyMedia: false,
        loop: 1
      })
      .dial({
        answerOnBridge: true,
        target: [
          {
            type: 'user',
            name: '1000@aws.jambonz.demo.novait.com.ua'
          }
        ],
        confirmHook: '/dial/confirm',
        actionHook: '/dial/action',
        dialMusic: 'https://cdn.freesound.org/previews/39/39061_402511-lq.mp3'
      });
    res.status(200).json(app);
  } catch (err) {
    console.error({err}, 'Error');
    res.sendStatus(503);
  }
});

router.post('/confirm', (req, res) => {
  console.log({payload: req.body}, 'POST /dial/confirm');
  try {
    const app = new WebhookResponse();
    app.tag({
      data: {
        'dummy': 'tag'
      }
    });
    setTimeout(async () => {
      // sip device must must reinvite session with hold purpose
      const a = await axios.post(`http://aws.jambonz.demo.novait.com.ua/api/v1/Accounts/9351f46a-678c-43f5-b8a6-d4eb58d131af/Calls/${req.body.parent_call_sid}`, {
        call_hook: 'https://03f5-91-197-168-161.ngrok-free.app/dial/hold'
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 1cf2f4f4-64c4-4249-9a3e-5bb4cb597c2a'
        },
      });
      console.log({a}, 'Update call');
    }, 10000);
    res.status(200).json(app);
  } catch (err) {
    console.error({err}, 'Error');
    res.sendStatus(503);
  }
});

router.post('/hold', (req, res) => {
  console.log({payload: req.body}, 'POST /dial/hold');
  try {
    const app = new WebhookResponse();
    app
      .play({
        url: 'silence_stream://500'
      })
      .enqueue({
        name: 'hold',
        waitHook: '/dial/hold-music'
      });
    res.status(200).json(app);
  } catch (err) {
    console.error({err}, 'Error');
    res.sendStatus(503);
  }
});

router.post('/hold-music', (req, res) => {
  console.log({payload: req.body}, 'POST /dial/hold-music');
  try {
    const app = new WebhookResponse();
    app
      .play({
        url: 'https://www.starface.de/support/resources/moh/01_303-groove.wav'
      })
    res.status(200).json(app);
  } catch (err) {
    console.error({err}, 'Error');
    res.sendStatus(503);
  }
});

module.exports = router;