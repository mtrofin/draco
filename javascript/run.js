'use strict';

if (typeof arguments == 'undefined' || arguments.length != 1) {
    print ("pass exactly one argument - the .drc file to decode");
    print ("example: d8 run.js -- my_file.drc");
}

load('draco_decoder.js');
TestMeshDecoding(arguments[0]);

function TestMeshDecoding(filename) {
    const arrayBuffer = readbuffer(filename);
    const byteArray = new Uint8Array(arrayBuffer);
    // commentnst total_t0 = performance.now();
    const buffer = new Module.DecoderBuffer();
    buffer.Init(byteArray, byteArray.length);

    const wrapper = new Module.WebIDLWrapper();

    const decode_t0 = performance.now();
    const geometryType = wrapper.GetEncodedGeometryType(buffer);
    let outputGeometry;
    if (geometryType == Module.TRIANGULAR_MESH) {
        outputGeometry = wrapper.DecodeMeshFromBuffer(buffer);
    } else {
        outputGeometry = wrapper.DecodePointCloudFromBuffer(buffer);
    }
    const t1 = performance.now();

    print("Time: ", t1-decode_t0);
    print("num points: ", outputGeometry.num_points());

    Module.destroy(outputGeometry);
    Module.destroy(wrapper);
    Module.destroy(buffer);
}
