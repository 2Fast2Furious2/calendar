import React from 'react';
import $ from 'jquery';
import moment from 'moment';
import styled from 'styled-components';
import RoomBasicData from './RoomBasicData.jsx';
import Options from './Options.jsx';
import FeeList from './FeeList.jsx';

const Container = styled.div`
  width: 420px;
  margin-right: auto;
  margin-left: auto;
`;

const Menu = styled.div`
  position: sticky;
  top: 80px;
  margin-top: 48px;
  border: 1px solid rgb(221, 221, 221);
  border-radius: 12px;
  padding: 24px;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 6px 16px;
`;

const Button = styled.button`
  cursor: pointer;
  display: inline-block;
  position: relative;
  text-align: center;
  touch-action: manipulation;
  font-family: Circular, -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif;
  font-size: 16px;
  line-height: 20px;
  font-weight: 600;
  padding-top: 14px;
  padding-bottom: 14px;
  padding-left: 24px;
  padding-right: 24px;
  color: rgb(255, 255, 255);
  width: 100%;
  margin: 0px;
  text-decoration: none;
  border-radius: 8px;
  outline: none;
  border-width: initial;
  border-style: none;
  border-color: initial;
  border-image: initial;
  background: linear-gradient(to right, rgb(230, 30, 77) 0%, rgb(227, 28, 95) 50%, rgb(215, 4, 102) 100%);
`;

const ButtonWord = styled.span`
  display: block;
  position: relative;
  pointer-events: none;
`;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      roomId: null,
      allData: [],
      nightly_fee: 0,
      rating: 0,
      reviews: 0,
      minimum_stay: 0,
      maximum_guest: 0,
      booked_date: [],
      checkInDateMomentObj: null,
      checkOutDateMomentObj: null,
      mouseX: 0,
      mouseY: 0,
      adults: 1,
      children: 0,
      infants: 0,
      hover: false
    }
    this.getCheckInDate = this.getCheckInDate.bind(this);
    this.getCheckOutDate = this.getCheckOutDate.bind(this);
    this.clearDate = this.clearDate.bind(this);
    this.postReservationData = this.postReservationData.bind(this);
    this.toggleHover = this.toggleHover.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.add = this.add.bind(this);
    this.subtract = this.subtract.bind(this);
  }

  // get all the informations and reservations of a specify room with the input room id
  //TBD: convert to use Postgres data format
  getRoomData(roomID) {
    $.get(`/rooms/${roomID}/reservation`, (data) => {
      console.log("GET request succeed");
      //console.log(data);

      let bookedDates = [];

      for(let i = 0; i < data.length; i++) {
        let check_in = moment(data[i].start_date);
        let check_out = moment(data[i].end_date);

        for(let j = check_in; j <= check_out; check_in.add(1,'days')) {
          bookedDates.push(check_in.format('YYYY-MM-DD'));
        }
      }

      //console.log(bookedDates);

      this.setState({
        roomId: roomID,
        allData : data,
        nightly_fee : data[0].nightly_fee,
        rating : data[0].rating,
        reviews : data[0].reviews,
        minimum_stay : data[0].minimum_stay,
        maximum_guest : data[0].maximum_guest,
        /*
         * In the localhost database, the retrieved date is formated like 2020-09-01T07:00:00.000Z,
         * as this date transformed to moment object, the date will be stay the same (2020-09-01).
         * In the database pulled from the DockerHub, the retrieved date is formated like 2020-09-01T00:00:00.000Z,
         * as this date transformed to moment object, the date will be ROUNDED to the last date (2020-08-31).
         * Since the time zones are different, in order to prevent the dated rounded to the last date,
         * we need to take out the time zone by using slice
         */
        booked_date : bookedDates
      });
      console.log(this.state);
    });
  }

  // post the current reservation to the corresponding room with the current room id in state
  postReservationData() {
    // declare the reservation data to post
    let reservation = {
      check_in: this.state.checkInDateMomentObj.format('YYYY-MM-DD'),
      check_out: this.state.checkOutDateMomentObj.format('YYYY-MM-DD')
    }
    $.post(`/rooms/${this.state.roomId}/reservation`, reservation, () => {
      console.log("POST request succeed");
      // clear the posted reservation data
      this.clearDate();
      // get the updated data of the corresponding room
      this.getRoomData(this.state.roomId);
    });
  }

  componentDidMount(){
    // get a room id by path
    let roomID = window.location.pathname.split('/')[2];
    this.getRoomData(roomID);
  }

  getCheckInDate(dateMomentObj) {
    console.log("check in: ", dateMomentObj);
    this.setState({
      checkInDateMomentObj: dateMomentObj
    });
  }

  getCheckOutDate(dateMomentObj) {
    console.log("check out: ", dateMomentObj);
    this.setState({
      checkOutDateMomentObj: dateMomentObj
    });
  }

  clearDate() {
    this.setState({
      checkInDateMomentObj: null,
      checkOutDateMomentObj: null,
      adults: 1,
      children: 0,
      infants: 0
    });
  }

  getTotalNight(checkInDateMomentObj, checkOutDateMomentObj) {
    // get a copy of the checkInDateMomentObj
    let newCheckInDateMomentObj = moment(Object.assign({}, checkInDateMomentObj));
    let count = 0;
    while(newCheckInDateMomentObj.isBefore(checkOutDateMomentObj)) {
      count++;
      // add one day to the newCheckInDateMomentObj
      newCheckInDateMomentObj = newCheckInDateMomentObj.add(1, 'days');
    }
    return count;
  }

  toggleHover() {
    this.setState({
      hover: !this.state.hover
    });
  }

  handleMouseMove(event) {
    this.setState({
      mouseX: event.clientX - event.target.getBoundingClientRect().left,
      mouseY: event.clientY - event.target.getBoundingClientRect().top
    });
  }

  subtract(guestType) {
    if (guestType === 'Adults') {
      if (this.state.adults > 1) {
        this.setState({
          adults: this.state.adults - 1
        });
      }
    } else if (guestType === 'Children') {
      if (this.state.children > 0) {
        this.setState({
          children: this.state.children - 1
        });
      }
    } else if (guestType === 'Infants') {
      if (this.state.infants > 0) {
        this.setState({
          infants: this.state.infants - 1
        });
      }
    }
  }

  add(guestType) {
    if (guestType === 'Adults') {
      if (this.state.adults + this.state.children < this.state.maximum_guest) {
        this.setState({
          adults: this.state.adults + 1
        });
      }
    } else if (guestType === 'Children') {
      if (this.state.adults + this.state.children < this.state.maximum_guest) {
        this.setState({
          children: this.state.children + 1
        });
      }
    } else if (guestType === 'Infants') {
      if (this.state.infants < 5) {
        this.setState({
          infants: this.state.infants + 1
        });
      }
    }
  }

  render() {
    let totalNight = null;
    let totalNightlyFee = null;
    let cleaningFee = null;
    let serviceFee = null;
    let totalFee = null;
    let feeList = null;
    let buttonStyle = {};

    if (this.state.hover) {
      buttonStyle = {
        'background': `radial-gradient(circle at ${this.state.mouseX}px ${this.state.mouseY}px, #FF385C 0%, #E61E4D 27.5%, #E31C5F 40%, #D70466 57.5%, #BD1E59 75%, #BD1E59 100%)`,
      };
    }

    let submitButton = <Button style={buttonStyle} onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover} onMouseMove={this.handleMouseMove}><ButtonWord>Check availability</ButtonWord></Button>;

    // if check in date and check out date is already selected
    if (this.state.checkInDateMomentObj && this.state.checkOutDateMomentObj) {
      // use the check in date and check out date to find the total nights
      totalNight = this.getTotalNight(this.state.checkInDateMomentObj, this.state.checkOutDateMomentObj);
      // use the total nights times the nightly fee to find the total nightly fee
      totalNightlyFee = totalNight * this.state.nightly_fee;
      // use the nightly fee to find the cleaning fee (around 65% of nightly fee)
      cleaningFee = Number((this.state.nightly_fee * 0.65).toFixed(0));
      // use the total nightly fee and the cleaning fee to find the service fee ((Total nightly fee + cleaning fee) * 0.142)
      serviceFee = Number(((totalNightlyFee + cleaningFee) * 0.142).toFixed(0));
      // get the total fee
      totalFee = totalNightlyFee + cleaningFee + serviceFee;
      // update feeList
      feeList = <FeeList nightly_fee={this.state.nightly_fee} totalNight={totalNight} totalNightlyFee={totalNightlyFee} cleaningFee={cleaningFee} serviceFee={serviceFee} totalFee={totalFee}/>
      // update submit button
      submitButton = <Button onClick={this.postReservationData} style={buttonStyle} onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover} onMouseMove={this.handleMouseMove}><ButtonWord>Reserve</ButtonWord></Button>;
    }

    return(
      <Container>
        <Menu>
          <RoomBasicData nightly_fee={this.state.nightly_fee} rating={this.state.rating} reviews={this.state.reviews}/>
          <Options
            minimum_stay={this.state.minimum_stay}
            maximum_guest={this.state.maximum_guest}
            booked_date={this.state.booked_date}
            getCheckInDate={this.getCheckInDate}
            getCheckOutDate={this.getCheckOutDate}
            checkInDateMomentObj={this.state.checkInDateMomentObj}
            checkOutDateMomentObj={this.state.checkOutDateMomentObj}
            clearDate={this.clearDate}
            adults={this.state.adults}
            children={this.state.children}
            infants={this.state.infants}
            add={this.add}
            subtract={this.subtract}
          />
          {submitButton}
          {feeList}
        </Menu>
      </Container>
    )
  }
}

export default App;

