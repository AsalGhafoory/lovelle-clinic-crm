import { Link } from "react-router-dom";

import { useEffect, useMemo, useState } from "react";

import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from "firebase/firestore";

import {
  Users,
  CalendarDays,
  Clock3
} from "lucide-react";

import { db } from "./firebase";

import Layout from "./components/Layout";

import Card from "./components/ui/Card";
import Button from "./components/ui/Button";
import Input from "./components/ui/Input";
import SectionHeader from "./components/ui/SectionHeader";
import EmptyState from "./components/ui/EmptyState";
import Badge from "./components/ui/Badge";
import StatCard from "./components/ui/StatCard";
import PageHeader from "./components/ui/PageHeader";
import LoadingCard from "./components/ui/LoadingCard";

import {
  formatDisplayDate,
  formatDisplayTime,
  getLocalDateKey
} from "./utils/date";

export default function App() {

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [clients, setClients] = useState([]);

  const [appointments, setAppointments] = useState([]);

  const [clientsLoading, setClientsLoading] = useState(true);

  const [appointmentsLoading, setAppointmentsLoading] = useState(true);

  const [savingClient, setSavingClient] = useState(false);

  const [clientSaved, setClientSaved] = useState(false);

  useEffect(() => {

    const unsubscribeClients = onSnapshot(
      collection(db, "clients"),
      (snapshot) => {

        const clientArray = [];

        snapshot.forEach((doc) => {

          clientArray.push({
            id: doc.id,
            ...doc.data()
          });

        });

        setClients(clientArray);
        setClientsLoading(false);

      }
    );

    const appointmentsQuery = query(
      collection(db, "appointments"),
      orderBy("date", "asc")
    );

    const unsubscribeAppointments = onSnapshot(
      appointmentsQuery,
      (snapshot) => {

        const appointmentsArray = [];

        snapshot.forEach((doc) => {

          appointmentsArray.push({
            id: doc.id,
            ...doc.data()
          });

        });

        setAppointments(appointmentsArray);
        setAppointmentsLoading(false);

      }
    );

    return () => {

      unsubscribeClients();
      unsubscribeAppointments();

    };

  }, []);

  async function addClient() {

    if (!name.trim() || !email.trim()) {

      alert("Fill all fields");
      return;

    }

    try {

      setSavingClient(true);

      await addDoc(collection(db, "clients"), {

        name: name.trim(),

        email: email.trim(),

        tags: [],

        phone: "",

        lastVisit: "",

        createdAt: serverTimestamp()

      });

      setName("");
      setEmail("");
      setClientSaved(true);

      window.setTimeout(() => {

        setClientSaved(false);

      }, 2200);

    } catch (error) {

      console.log(error);

    } finally {

      setSavingClient(false);

    }

  }

  const upcomingAppointments = useMemo(() => {

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    return appointments.filter((appointment) => {

      if (!appointment.date || appointment.completedAt) return false;

      const appointmentDate = new Date(`${appointment.date}T00:00:00`);

      return appointmentDate >= today;

    });

  }, [appointments]);

  const appointmentPreview = useMemo(() => {

    return upcomingAppointments.slice(0, 5);

  }, [upcomingAppointments]);

  const todayAppointments = useMemo(() => {

    const todayKey = getLocalDateKey(new Date());

    return appointments.filter((appointment) => {

      if (appointment.completedAt) return false;

      return appointment.date === todayKey;

    });

  }, [appointments]);

  return (

    <Layout>

      <div className="mb-10 sm:mb-12">

        <PageHeader
          eyebrow="Luxury Wellness CRM"
          title="Client Experience Dashboard"
          description="
            Manage premium wellness relationships,
            appointments, and personalized client experiences.
          "
        />

      </div>

      {/* STATS */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">

        {clientsLoading ? (

          <LoadingCard />

        ) : (

          <StatCard
            title="Total Clients"
            value={clients.length}
            icon={Users}
          />

        )}

        {appointmentsLoading ? (

          <LoadingCard />

        ) : (

          <StatCard
            title="Upcoming Appointments"
            value={upcomingAppointments.length}
            icon={CalendarDays}
          />

        )}

        <StatCard
          title="Today’s Schedule"
          value={todayAppointments.length}
          icon={Clock3}
        />

      </div>

      {/* MAIN GRID */}

      <div className="grid grid-cols-1 2xl:grid-cols-[420px_1fr] gap-8">

        {/* LEFT SIDE */}

        <div className="space-y-8">

          {/* ADD CLIENT */}

          <Card className="h-fit">

            <div className="flex items-start justify-between gap-4">

              <SectionHeader
                eyebrow="New Client"
                title="Add Client"
              />

              {clientSaved && (

                <Badge
                  variant="light"
                  className="px-4 py-2 text-xs"
                >
                  Saved
                </Badge>

              )}

            </div>

            <div className="space-y-4 mt-8">

              <Input
                type="text"
                placeholder="Client Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <Input
                type="email"
                placeholder="Client Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Button
                onClick={addClient}
                disabled={savingClient}
                className="w-full mt-2"
              >
                {savingClient ? "Saving..." : "Save Client"}
              </Button>

            </div>

          </Card>

          {/* UPCOMING APPOINTMENTS */}

          <Card>

            <div className="flex items-center justify-between mb-8">

              <SectionHeader
                eyebrow="Calendar"
                title="Upcoming Appointments"
              />

              <Badge variant="light">

                {upcomingAppointments.length}

              </Badge>

            </div>

            {appointmentsLoading ? (

              <LoadingCard />

            ) : upcomingAppointments.length === 0 && (

              <EmptyState
                title="No Appointments Yet"
                description="
                  Start scheduling wellness experiences
                  for your clients.
                "
                actionLabel="Book Appointment"
                actionTo="/appointments"
              />

            )}

            {!appointmentsLoading && (

              <div className="space-y-4">

                {appointmentPreview.map((appointment) => (

                <div
                  key={appointment.id}
                  className="
                    border
                    border-black/[0.04]
                    rounded-[24px]
                    p-5
                    bg-[#fcfcfb]
                  "
                >

                  <div className="flex items-start justify-between gap-4 mb-4">

                    <div>

                      <p className="font-semibold text-lg">
                        {appointment.clientName}
                      </p>

                      <p className="text-gray-500 mt-1">
                        {appointment.treatment}
                      </p>

                    </div>

                    <Badge variant="light">

                      Scheduled

                    </Badge>

                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-500">

                    <CalendarDays size={16} />

                    <p>
                      {formatDisplayDate(appointment.date)}
                    </p>

                    <span>•</span>

                    <p>
                      {formatDisplayTime(appointment.time)}
                    </p>

                    {appointment.duration && (

                      <>

                        <span>•</span>

                        <p>
                          {appointment.duration}
                        </p>

                      </>

                    )}

                  </div>

                </div>

                ))}

              </div>

            )}

          </Card>

        </div>

        {/* RECENT CLIENTS */}

        <Card>

          <div className="flex items-center justify-between mb-8">

            <SectionHeader
              eyebrow="Recent Activity"
              title="Recent Clients"
            />

            <Link
              to="/clients"
              className="
                text-sm
                font-medium
                text-gray-500
                hover:text-black
                transition-colors
              "
            >

              View All →

            </Link>

          </div>

          {clientsLoading ? (

            <LoadingCard />

          ) : clients.length === 0 && (

            <EmptyState
              title="No Clients Yet"
              description="
                Begin building your wellness client experience
                by adding your first client.
              "
              actionLabel="Go to Clients"
              actionTo="/clients"
            />

          )}

          {!clientsLoading && (

            <div className="space-y-4">

              {clients.slice(0, 4).map((client) => (

              <Link
                to={`/client/${client.id}`}
                key={client.id}
              >

                <div
                  className="
                    border
                    border-black/[0.04]
                    rounded-[26px]
                    p-5
                    flex
                    items-center
                    justify-between
                    gap-5
                    hover:bg-[#fafaf8]
                    hover:-translate-y-[2px]
                    hover:shadow-lg
                    transition-all
                    duration-300
                  "
                >

                  <div className="min-w-0">

                    <p className="text-lg font-semibold truncate">
                      {client.name}
                    </p>

                    <p className="text-gray-500 mt-1 truncate">
                      {client.email}
                    </p>

                  </div>

                  <div
                    className="
                      w-11
                      h-11
                      rounded-2xl
                      bg-[#f3f3f0]
                      flex
                      items-center
                      justify-center
                      shrink-0
                    "
                  >

                    <Users size={18} />

                  </div>

                </div>

              </Link>

              ))}

            </div>

          )}

        </Card>

      </div>

    </Layout>

  );

}
