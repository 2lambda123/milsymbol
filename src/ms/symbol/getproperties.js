import { ms } from "../../ms.js";
export default function getProperties() {
  var properties = {
    activity: false, //Is it an Activity
    affiliation: "", //Affiliation it is shown as (Friend/Hostile...)
    baseAffilation: "", //Affiliation it belongs to (Friend/Hostile...)
    baseDimension: "", //Dimension it belongs to (Air/Ground...)
    baseGeometry: { g: "", bbox: {} }, //Geometry is a combination of dimension and affiliation (AirFriend/GroundHostile...)
    civilian: false, //Is it Civilian
    condition: "", //What condition is it in
    context: "", //Context of the symbol (Reality/Exercise...)
    dimension: "", //Dimension it is shown as (Air/Ground...)
    dimensionUnknown: false, //Is the dimension unknown
    echelon: "", //What echelon (Platoon/Company...)
    faker: false, //Is it a Faker
    fenintDummy: false, //Is it a feint/dummy
    fill: this.style.fill, //Standard says it should be filled
    frame: this.style.frame, //Standard says it should be framed
    functionid: "", //Part of SIDC referring to the icon.
    headquarters: false, //Is it a Headquarters
    //"iconBottom"		: 100,		//The bottom of the icon
    installation: false, //Is it an Instalation
    joker: false, //Is it a Joker
    mobility: "", //What mobility (Tracked/Sled)
    notpresent: "", //Is it Anticipated or Pending
    numberSIDC: false, //Is the SIDC number based
    space: false, //Is it in Space
    taskForce: false, //Is it a task force
    unit: false // Is this equipment or not
  };
  var mapping = {};
  mapping.context = ["Reality", "Exercise", "Simulation"];
  mapping.status = [
    "Present",
    "Planned",
    "FullyCapable",
    "Damaged",
    "Destroyed",
    "FullToCapacity"
  ];
  mapping.echelonMobility = {
    "11": "Team/Crew",
    "12": "Squad",
    "13": "Section",
    "14": "Platoon/detachment",
    "15": "Company/battery/troop",
    "16": "Battalion/squadron",
    "17": "Regiment/group",
    "18": "Brigade",
    "21": "Division",
    "22": "Corps/MEF",
    "23": "Army",
    "24": "Army Group/front",
    "25": "Region/Theater",
    "26": "Command",
    "31": "Wheeled limited cross country",
    "32": "Wheeled cross country",
    "33": "Tracked",
    "34": "Wheeled and tracked combination",
    "35": "Towed",
    "36": "Rail",
    "37": "Pack animals",
    "41": "Over snow (prime mover)",
    "42": "Sled",
    "51": "Barge",
    "52": "Amphibious",
    "61": "Short towed array",
    "62": "Long towed Array",
    "71": "Leader Individual",
    "72": "Deputy Individual"
  };

  mapping.affiliation = ["Hostile", "Friend", "Neutral", "Unknown"];
  mapping.dimension = ["Air", "Ground", "Sea", "Subsurface"];

  properties.context = mapping.context[0];

  if (this.style.monoColor != "") {
    properties.fill = false;
  }
  this.options.sidc = String(this.options.sidc)
    .replace(/\*/g, "-")
    .replace(/ /g, "");

  properties.numberSIDC = !isNaN(this.options.sidc);
  if (properties.numberSIDC) {
    //This is for new number based SIDCs

    if (typeof ms._getNumberProperties === "function") {
      properties = ms._getNumberProperties.call(this, properties, mapping);
    } else {
      console.warn(
        "ms._getNumberProperties() is not present, you will need to load functionality for number based SIDCs"
      );
    }
  } else {
    //This would be old letter based SIDCs

    if (typeof ms._getLetterProperties === "function") {
      properties = ms._getLetterProperties.call(this, properties, mapping);
    } else {
      console.warn(
        "ms._getLetterProperties() is not present, you will need to load functionality for letter based SIDCs"
      );
    }
  }

  if (
    ms._symbolGeometries.hasOwnProperty(
      properties.dimension + properties.affiliation
    )
  ) {
    properties.baseGeometry =
      ms._symbolGeometries[properties.dimension + properties.affiliation];
  } else {
    properties.baseGeometry.bbox = new ms.BBox();
  }
  //If both frame and icon is turned off we should just have a position marker
  if (!this.style.frame && !this.style.icon) {
    properties.baseGeometry = ms._symbolGeometries.PositionMarker;
  }

  return properties;
}
