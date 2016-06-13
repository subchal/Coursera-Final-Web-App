var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var presetSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: false
  },
  sliders: {
    type: Array,
    default: [0.01, 0.01, 0.01, 0.01, 0.01],
    length: 5
  },
  rootIndex: {
    type: Number,
    default: 0
  },
  key: {
    type: String,
    default: 'major'
  },
  soundType: {
    type: String,
    default: 'triangle'
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
});

var Presets = mongoose.model('Preset', presetSchema);
module.exports = Presets;
