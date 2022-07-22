pragma solidity 0.8.14;

contract myContract3{



    struct Sensor{
        uint id;
        uint sensor_id;
        uint area_id;
        uint location_id;
        uint bid;
        string time;
        string date;
        uint sensorType;
        uint sensorData;
        bool isOut;
        
    }

    uint256 count;
    uint256 outCount;
    Sensor[] items;

    function add(
        uint bid,
        uint sensor_id,
        uint area_id,
        uint location_id,
        string memory time,
        string memory date,
        uint sensorType,
        uint sensorData
    ) public 
    {
        incrementCount();
        if(isOut(sensorType, sensorData)){
            incrementOutCount();
            items.push(Sensor(getCount(),sensor_id,area_id,location_id,bid,time,date,sensorType,sensorData,true));
        }
        else{
            items.push(Sensor(getCount(),sensor_id,area_id,location_id,bid,time,date,sensorType,sensorData,false));
        }
    }

    function read(uint out) public view returns (Sensor[] memory)
    {
        if(out == 1){
         uint size = getOutCount();
         Sensor[] memory outlierArray = new Sensor[](size);
         uint index = 0;
         for(uint ii = 0; ii< items.length; ii++ ){
             if(items[ii].isOut == true){
                outlierArray[index].id = items[ii].id;
                outlierArray[index].sensorData = items[ii].sensor_id;
                outlierArray[index].area_id = items[ii].area_id;
                outlierArray[index].location_id = items[ii].location_id;
                outlierArray[index].bid = items[ii].bid;
                outlierArray[index].time = items[ii].time;
                outlierArray[index].date = items[ii].date;
                outlierArray[index].sensorType = items[ii].sensorType;
                outlierArray[index].sensorData = items[ii].sensorData;
                outlierArray[index].isOut = items[ii].isOut;
                index = index + 1;
             }
         }

         return outlierArray;
         
        }
        else{
            return items;
        }
    }

    function incrementCount() private {
        count += 1;
    }
    function incrementOutCount() private {
        outCount += 1;
    }

    function getCount() private view returns(uint) {
        return count;
    }

    function getOutCount() private view returns(uint) {
        return outCount;
    }
    function isOut(uint sensorType, uint data) private pure returns(bool) {
        // TEMPERATURE
        if(sensorType == 0 && (data < 25 || data > 35 )){
            return true;
        }
        // air Humidity
        else if(sensorType == 1 && (data >= 40)){
            return true;
        }
        // Soil Moisture
        else if(sensorType == 2 && (data >= 500 )){
            return true;
        }
        // AQI 
        else if(sensorType == 3 && (data >= 200 )){
            return true;
        }
        // PH sensor 
        else if(sensorType == 4 && (data <= 4 || data >= 9 )){
            return true;
        }

        return false;
    }
}
