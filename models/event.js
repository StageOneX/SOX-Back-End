const { DataTypes, or } = require("sequelize");
const sequelize = require("../util/db");

const Event = sequelize.define("Event", {
    event_id:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    tenat_id:{
        type:DataTypes.UUID,
        allowNull:true,
    },
    code:{
        type:DataTypes.STRING
        ,allowNull:false,
        unique:true,
    },
    event_name:{
        type:DataTypes.STRING,
        allowNull:false,
        
    },
     slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  title: DataTypes.STRING,
  subtitle: DataTypes.STRING,
  summary : DataTypes.TEXT,
  description_html: DataTypes.TEXT,
  event_type: DataTypes.STRING,

  organizer_id:{
    type: DataTypes.UUID,
    allowNull: false,
  },

  default_timezone:{
    type:DataTypes.STRING,
    defaultValue:'Asia/Colombo',
  },
  default_timezone: {
    type: DataTypes.STRING,
    defaultValue: 'Asia/Colombo',
  },
  default_currency: {
    type: DataTypes.STRING,
    defaultValue: 'LKR',
  },
  default_venue_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('Draft', 'Published', 'Archived'),
    defaultValue: 'Draft',
  },
  visibility: {
    type: DataTypes.ENUM('Public', 'Unlisted', 'Private'),
    defaultValue: 'Public',
  },
  cover_image_url: DataTypes.STRING,
  promo_video_url: DataTypes.STRING,
  meta_title: DataTypes.STRING,
  meta_description: DataTypes.TEXT,
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  is_ticketed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  created_by: DataTypes.UUID,
  updated_by: DataTypes.UUID,
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'events',
  timestamps: false,
  paranoid: true, // enables soft delete
});

module.exports = Event;



