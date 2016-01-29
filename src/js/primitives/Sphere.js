import GLBoost from './../globals'
import Element from './../Element'
import GLContext from './../GLContext'
import GLExtentionsManager from './../GLExtentionsManager'
import Geometry from './../Geometry'
import Vector4 from './../math/Vector4'
import Vector3 from './../math/Vector3'
import Vector2 from './../math/Vector2'
import ArrayUtil from '.././misc/ArrayUtil'

export default class Sphere extends Geometry {
  constructor(radius, widthSegments, heightSegments, customVertexAttributes, canvas) {
    super(canvas);

    this._setupVertexData(radius, widthSegments, heightSegments, customVertexAttributes);
  }

  _setupVertexData(radius, widthSegments, heightSegments, customVertexAttributes) {

    // See below:
    // WebGL Lesson 11 - spheres, rotation matrices, and mouse events
    // http://learningwebgl.com/blog/?p=1253
    //
    var positions = [];
    var texcoords = [];
    var colors = [];
    var normals = [];
    var vertexColor = new Vector4(1, 1, 1, 1);

    for (var latNumber = 0; latNumber <= heightSegments; latNumber++) {
      var theta = latNumber * Math.PI / heightSegments;
      var sinTheta = Math.sin(theta);
      var cosTheta = Math.cos(theta);

      for (var longNumber = 0; longNumber <= widthSegments; longNumber++) {
        var phi = longNumber * 2 * Math.PI / widthSegments;
        var sinPhi = Math.sin(phi);
        var cosPhi = Math.cos(phi);

        var x = radius * cosPhi * sinTheta;
        var y = radius * cosTheta;
        var z = radius * sinPhi * sinTheta;
        var position = new Vector3(x, y, z);
        positions.push(position);
        var u = 1 - (longNumber / widthSegments);
        var v = 1 - (latNumber / heightSegments);
        texcoords.push(new Vector2(u, v));
        colors.push(vertexColor);
        normals.push(Vector3.normalize(position));
      }
    }
    
    // first    first+1
    //    +-------+
    //    |     / |
    //    |   /   |
    //    | /     |
    //    +-------+
    // second   second+1
    //
    var indices = [];
    for (var latNumber = 0; latNumber < heightSegments; latNumber++) {
      for (var longNumber = 0; longNumber < widthSegments; longNumber++) {
        var first = (latNumber * (widthSegments + 1)) + longNumber;
        var second = first + widthSegments + 1;
        
        indices.push(first + 1);
        indices.push(second);
        indices.push(first);
        
        indices.push(first + 1);
        indices.push(second + 1);
        indices.push(second);
      }
    }

    var object = {
      position: positions,
      color: colors,
      texcoord: texcoords,
      normal: normals
    };

    var completeAttributes = ArrayUtil.merge(object, customVertexAttributes);
    this.setVerticesData(completeAttributes, [indices], GLBoost.TRIANGLES);
  }

}

GLBoost["Sphere"] = Sphere;