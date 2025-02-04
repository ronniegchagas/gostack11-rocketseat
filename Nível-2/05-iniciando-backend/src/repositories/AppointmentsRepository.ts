import { isEqual } from 'date-fns';
import Appointment from '../models/Appointment';

interface CreateDataDTO {
  provider: string;
  date: Date;
}

class AppointmentRepository {
  private appointments: Appointment[];

  constructor() {
    this.appointments = [];
  }

  public all(): Appointment[] {
    return this.appointments;
  }

  public findByDate(date: Date): Appointment | null {
    const findAppointment = this.appointments.find((appointment) => (
      isEqual(date, appointment.date)
    ));

    return findAppointment || null;
  }

  public create({ provider, date }: CreateDataDTO): Appointment {
    const appointment = new Appointment({ provider, date });

    this.appointments.push(appointment);

    return appointment;
  }
}

export default AppointmentRepository;
