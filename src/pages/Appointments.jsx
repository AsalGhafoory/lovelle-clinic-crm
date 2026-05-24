import { useEffect, useMemo, useRef, useState } from "react";

import { Link } from "react-router-dom";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc
} from "firebase/firestore";

import {
  CalendarDays,
  Clock3,
  Edit3,
  Timer,
  Search,
  Sparkles,
  Trash2,
  UserRound
} from "lucide-react";

import { db } from "../firebase";

import Layout from "../components/Layout";

import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import SectionHeader from "../components/ui/SectionHeader";
import PageHeader from "../components/ui/PageHeader";
import LoadingCard from "../components/ui/LoadingCard";

import {
  formatDisplayDate,
  formatDisplayTime
} from "../utils/date";

import { treatmentTypes } from "../constants/treatments";

const appointmentDurations = [
  "30 minutes",
  "45 minutes",
  "60 minutes",
  "90 minutes"
];

const emptyAppointmentForm = {
  clientId: "",
  clientName: "",
  clientEmail: "",
  treatment: "",
  date: "",
  time: "",
  duration: "",
  notes: ""
};

export default function Appointments() {

  const [clients, setClients] = useState([]);

  const [appointments, setAppointments] = useState([]);

  const [form, setForm] = useState(emptyAppointmentForm);

  const [clientSearch, setClientSearch] = useState("");

  const [showClientDropdown, setShowClientDropdown] = useState(false);

  const [editingAppointmentId, setEditingAppointmentId] = useState(null);

  const [defaultDuration, setDefaultDuration] = useState("60 minutes");

  const [appointmentsLoading, setAppointmentsLoading] = useState(true);

  const [savingAppointment, setSavingAppointment] = useState(false);

  const [savedMessage, setSavedMessage] = useState("");

  const clientDropdownRef = useRef(null);

  useEffect(() => {

    const clientsQuery = query(
      collection(db, "clients"),
      orderBy("name", "asc")
    );

    const appointmentsQuery = query(
      collection(db, "appointments"),
      orderBy("date", "asc")
    );

    const unsubscribeClients = onSnapshot(
      clientsQuery,
      (snapshot) => {

        const clientArray = [];

        snapshot.forEach((doc) => {

          clientArray.push({
            id: doc.id,
            ...doc.data()
          });

        });

        setClients(clientArray);

      }
    );

    const unsubscribeAppointments = onSnapshot(
      appointmentsQuery,
      (snapshot) => {

        const appointmentArray = [];

        snapshot.forEach((doc) => {

          appointmentArray.push({
            id: doc.id,
            ...doc.data()
          });

        });

        setAppointments(appointmentArray);
        setAppointmentsLoading(false);

      }
    );

    const unsubscribeSettings = onSnapshot(
      doc(db, "workspaceSettings", "main"),
      (docSnap) => {

        if (docSnap.exists()) {

          const settings = docSnap.data();

          const savedDuration =
            settings.defaultDuration || "60 minutes";

          setDefaultDuration(savedDuration);

          setForm((currentForm) => {

            if (currentForm.duration) {

              return currentForm;

            }

            return {
              ...currentForm,
              duration: savedDuration
            };

          });

        }

      }
    );

    function handleClickOutside(event) {

      if (
        clientDropdownRef.current &&
        !clientDropdownRef.current.contains(event.target)
      ) {

        setShowClientDropdown(false);

      }

    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {

      unsubscribeClients();
      unsubscribeAppointments();
      unsubscribeSettings();

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

    };

  }, []);

  const filteredClients = useMemo(() => {

    const normalizedSearch = clientSearch.toLowerCase().trim();

    if (!normalizedSearch) return clients.slice(0, 8);

    return clients
      .filter((client) => {

        return (
          client.name
            ?.toLowerCase()
            .includes(normalizedSearch) ||
          client.email
            ?.toLowerCase()
            .includes(normalizedSearch)
        );

      })
      .slice(0, 8);

  }, [clients, clientSearch]);

  const upcomingAppointments = useMemo(() => {

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    return appointments.filter((appointment) => {

      if (!appointment.date) return true;

      if (appointment.completedAt) return false;

      const appointmentDate = new Date(`${appointment.date}T00:00:00`);

      return appointmentDate >= today;

    });

  }, [appointments]);

  const completedAppointments = useMemo(() => {

    return appointments.filter((appointment) => appointment.completedAt);

  }, [appointments]);

  const selectedClient = form.clientId
    ? clients.find((client) => client.id === form.clientId)
    : null;

  function updateForm(field, value) {

    setForm((currentForm) => ({
      ...currentForm,
      [field]: value
    }));

  }

  function selectClient(client) {

    setForm((currentForm) => ({
      ...currentForm,
      clientId: client.id,
      clientName: client.name || "",
      clientEmail: client.email || ""
    }));

    setClientSearch(client.name || "");
    setShowClientDropdown(false);

  }

  function resetForm() {

    setForm({
      ...emptyAppointmentForm,
      duration: defaultDuration
    });
    setClientSearch("");
    setEditingAppointmentId(null);
    setShowClientDropdown(false);

  }

  async function saveAppointment() {

    if (
      !form.clientId ||
      !form.treatment.trim() ||
      !form.date ||
      !form.time
    ) {

      alert("Choose a client, treatment, date, and time.");
      return;

    }

    const appointmentData = {
      clientId: form.clientId,
      clientName: form.clientName,
      clientEmail: form.clientEmail,
      treatment: form.treatment.trim(),
      date: form.date,
      time: form.time,
      duration: form.duration || defaultDuration,
      notes: form.notes.trim(),
      updatedAt: serverTimestamp()
    };

    try {

      setSavingAppointment(true);

      if (editingAppointmentId) {

        await updateDoc(
          doc(db, "appointments", editingAppointmentId),
          appointmentData
        );

      } else {

        await addDoc(
          collection(db, "appointments"),
          {
            ...appointmentData,
            createdAt: serverTimestamp()
          }
        );

      }

      resetForm();
      setSavedMessage(
        editingAppointmentId
          ? "Appointment updated"
          : "Appointment booked"
      );

      window.setTimeout(() => {

        setSavedMessage("");

      }, 2400);

    } catch (error) {

      console.log(error);

    } finally {

      setSavingAppointment(false);

    }

  }

  async function completeAppointment(appointment) {

    const confirmComplete = window.confirm(
      "Mark this appointment as completed and add it to the client treatment history?"
    );

    if (!confirmComplete) return;

    try {

      await addDoc(
        collection(db, "clients", appointment.clientId, "timeline"),
        {
          treatment: appointment.treatment,
          date: appointment.date,
          duration: appointment.duration || defaultDuration,
          appointmentId: appointment.id,
          createdAt: serverTimestamp()
        }
      );

      await updateDoc(
        doc(db, "appointments", appointment.id),
        {
          completedAt: serverTimestamp()
        }
      );

      setSavedMessage("Appointment completed");

      window.setTimeout(() => {

        setSavedMessage("");

      }, 2400);

    } catch (error) {

      alert(error.message);

    }

  }

  function editAppointment(appointment) {

    setEditingAppointmentId(appointment.id);

    setForm({
      clientId: appointment.clientId || "",
      clientName: appointment.clientName || "",
      clientEmail: appointment.clientEmail || "",
      treatment: appointment.treatment || "",
      date: appointment.date || "",
      time: appointment.time || "",
      duration: appointment.duration || defaultDuration,
      notes: appointment.notes || ""
    });

    setClientSearch(appointment.clientName || "");
    setShowClientDropdown(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }

  async function deleteAppointment(appointmentId) {

    const confirmDelete = window.confirm(
      "Delete this appointment?"
    );

    if (!confirmDelete) return;

    try {

      await deleteDoc(
        doc(db, "appointments", appointmentId)
      );

      if (editingAppointmentId === appointmentId) {

        resetForm();

      }

    } catch (error) {

      console.log(error);

    }

  }

  return (

    <Layout>

      <div className="mb-10">

        <PageHeader
          eyebrow="Scheduling"
          title="Appointments"
          description="
            Book treatments, connect each visit to a real client,
            and keep the schedule calm and organized.
          "
        >

          <div className="flex flex-wrap gap-3">

            {savedMessage && (

              <Badge variant="light">
                {savedMessage}
              </Badge>

            )}

            <Badge variant="light">
              {upcomingAppointments.length} Upcoming
            </Badge>

          </div>

        </PageHeader>

      </div>

      <div className="grid grid-cols-1 2xl:grid-cols-[440px_1fr] gap-8">

        {/* BOOKING FORM */}

        <Card className="h-fit">

          <div className="flex items-start justify-between gap-4 mb-8">

            <SectionHeader
              eyebrow={editingAppointmentId ? "Update Booking" : "New Booking"}
              title={editingAppointmentId ? "Reschedule Visit" : "Book Appointment"}
            />

            <div
              className="
                w-14
                h-14
                rounded-2xl
                bg-[#f5f5f4]
                flex
                items-center
                justify-center
                shrink-0
              "
            >

              <CalendarDays size={22} />

            </div>

          </div>

          <div className="space-y-5">

            <div
              className="relative"
              ref={clientDropdownRef}
            >

              <div className="relative">

                <Search
                  size={18}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <Input
                  type="text"
                  placeholder="Search client..."
                  value={clientSearch}
                  onChange={(e) => {
                    setClientSearch(e.target.value);
                    updateForm("clientId", "");
                    updateForm("clientName", "");
                    updateForm("clientEmail", "");
                    setShowClientDropdown(true);
                  }}
                  onFocus={() => setShowClientDropdown(true)}
                  className="pl-12"
                />

              </div>

              {showClientDropdown && (

                <div
                  className="
                    absolute
                    top-full
                    left-0
                    right-0
                    mt-2
                    bg-white
                    border
                    border-black/[0.06]
                    rounded-[24px]
                    shadow-xl
                    overflow-hidden
                    z-50
                    max-h-[300px]
                    overflow-y-auto
                  "
                >

                  {filteredClients.length === 0 ? (

                    <div className="px-5 py-4 text-gray-500">
                      No clients found.
                    </div>

                  ) : (

                    filteredClients.map((client) => (

                      <button
                        key={client.id}
                        type="button"
                        onClick={() => selectClient(client)}
                        className="
                          w-full
                          text-left
                          px-5
                          py-4
                          hover:bg-[#f7f7f5]
                          transition-colors
                        "
                      >

                        <p className="font-medium">
                          {client.name}
                        </p>

                        <p className="text-sm text-gray-500 mt-1">
                          {client.email}
                        </p>

                      </button>

                    ))

                  )}

                </div>

              )}

            </div>

            {selectedClient && (

              <div
                className="
                  flex
                  items-center
                  gap-3
                  rounded-[22px]
                  border
                  border-black/[0.04]
                  bg-[#fcfcfb]
                  px-5
                  py-4
                "
              >

                <UserRound
                  size={18}
                  className="text-gray-400"
                />

                <div className="min-w-0">

                  <p className="font-medium truncate">
                    {selectedClient.name}
                  </p>

                  <p className="text-sm text-gray-500 truncate">
                    {selectedClient.email}
                  </p>

                </div>

              </div>

            )}

            <div>

              <Input
                list="appointment-treatment-options"
                type="text"
                placeholder="Treatment"
                value={form.treatment}
                onChange={(e) => updateForm("treatment", e.target.value)}
              />

              <datalist id="appointment-treatment-options">

                {treatmentTypes.map((treatment) => (

                  <option
                    key={treatment}
                    value={treatment}
                  />

                ))}

              </datalist>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              <Input
                type="date"
                value={form.date}
                onChange={(e) => updateForm("date", e.target.value)}
              />

              <Input
                type="time"
                value={form.time}
                onChange={(e) => updateForm("time", e.target.value)}
              />

              <select
                value={form.duration || defaultDuration}
                onChange={(e) => updateForm("duration", e.target.value)}
                className="
                  vela-input
                  appearance-none
                "
              >

                {appointmentDurations.map((duration) => (

                  <option
                    key={duration}
                    value={duration}
                  >
                    {duration}
                  </option>

                ))}

              </select>

            </div>

            <Textarea
              placeholder="Appointment notes..."
              value={form.notes}
              onChange={(e) => updateForm("notes", e.target.value)}
            />

            <div className="flex flex-col sm:flex-row gap-3">

              <Button
                onClick={saveAppointment}
                disabled={savingAppointment}
                className="flex-1 flex items-center justify-center gap-3"
              >

                <Sparkles size={18} />

                {savingAppointment
                  ? "Saving..."
                  : editingAppointmentId
                    ? "Save Changes"
                    : "Book Appointment"
                }

              </Button>

              {editingAppointmentId && (

                <button
                  type="button"
                  onClick={resetForm}
                  className="
                    px-6
                    py-4
                    rounded-[20px]
                    border
                    border-black/[0.06]
                    bg-white/70
                    text-gray-600
                    hover:text-black
                    hover:bg-white
                  "
                >
                  Cancel
                </button>

              )}

            </div>

          </div>

        </Card>

        {/* APPOINTMENT LIST */}

        <Card>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-8">

            <SectionHeader
              eyebrow="Calendar"
              title="Upcoming Schedule"
              subtitle="A clean view of booked client visits."
            />

            <Badge variant="light">

              {upcomingAppointments.length} Upcoming

            </Badge>

          </div>

          {appointmentsLoading ? (

            <LoadingCard />

          ) : upcomingAppointments.length === 0 ? (

            <EmptyState
              title="No Appointments Yet"
              description="
                Start by booking a client visit from the scheduling form.
              "
            />

          ) : (

            <div className="space-y-4">

              {upcomingAppointments.map((appointment) => (

                <div
                  key={appointment.id}
                  className="
                    border
                    border-black/[0.04]
                    rounded-[28px]
                    p-5
                    sm:p-6
                    bg-[#fcfcfb]
                    hover:bg-[#fafaf8]
                    hover:shadow-lg
                    hover:-translate-y-[2px]
                    transition-all
                    duration-300
                  "
                >

                  <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">

                    <div className="min-w-0">

                      <Link
                        to={`/client/${appointment.clientId}`}
                        className="
                          inline-flex
                          items-center
                          gap-3
                          text-gray-500
                          hover:text-black
                          mb-3
                        "
                      >

                        <UserRound
                          size={17}
                          className="text-gray-400"
                        />

                        <span className="font-medium">
                          {appointment.clientName || "Client"}
                        </span>

                      </Link>

                      <div className="flex flex-wrap items-center gap-3">

                        <h2 className="text-2xl font-semibold tracking-tight">
                          {appointment.treatment}
                        </h2>

                        <Badge
                          variant="light"
                          className="px-4 py-2 text-xs"
                        >
                          Booked
                        </Badge>

                      </div>

                      {appointment.notes && (

                        <p className="text-gray-500 leading-relaxed mt-4 max-w-2xl">
                          {appointment.notes}
                        </p>

                      )}

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3 gap-3 shrink-0">

                      <div
                        className="
                          flex
                          items-center
                          gap-3
                          px-5
                          py-3
                          rounded-full
                          bg-[#f3f3f0]
                          border
                          border-black/[0.04]
                          text-sm
                          font-medium
                          text-gray-700
                          whitespace-nowrap
                        "
                      >

                        <CalendarDays size={16} />

                        {formatDisplayDate(appointment.date)}

                      </div>

                      <div
                        className="
                          flex
                          items-center
                          gap-3
                          px-5
                          py-3
                          rounded-full
                          bg-[#f3f3f0]
                          border
                          border-black/[0.04]
                          text-sm
                          font-medium
                          text-gray-700
                          whitespace-nowrap
                        "
                      >

                        <Clock3 size={16} />

                        {formatDisplayTime(appointment.time)}

                      </div>

                      <div
                        className="
                          flex
                          items-center
                          gap-3
                          px-5
                          py-3
                          rounded-full
                          bg-[#f3f3f0]
                          border
                          border-black/[0.04]
                          text-sm
                          font-medium
                          text-gray-700
                          whitespace-nowrap
                        "
                      >

                        <Timer size={16} />

                        {appointment.duration || "60 minutes"}

                      </div>

                    </div>

                  </div>

                  <div className="flex flex-wrap justify-end gap-3 mt-6 pt-5 border-t border-black/[0.04]">

                    <button
                      type="button"
                      onClick={() => editAppointment(appointment)}
                      className="
                        inline-flex
                        items-center
                        justify-center
                        gap-3
                        px-5
                        py-3
                        rounded-[18px]
                        bg-white
                        border
                        border-black/[0.06]
                        text-sm
                        font-medium
                        text-gray-700
                        hover:text-black
                        hover:shadow-sm
                      "
                    >

                      <Edit3 size={16} />

                      Edit

                    </button>

                    <button
                      type="button"
                      onClick={() => completeAppointment(appointment)}
                      className="
                        inline-flex
                        items-center
                        justify-center
                        gap-3
                        px-5
                        py-3
                        rounded-[18px]
                        bg-black
                        text-white
                        text-sm
                        font-medium
                        hover:-translate-y-[1px]
                        hover:shadow-lg
                      "
                    >

                      Complete

                    </button>

                    <button
                      type="button"
                      onClick={() => deleteAppointment(appointment.id)}
                      className="
                        inline-flex
                        items-center
                        justify-center
                        gap-3
                        px-5
                        py-3
                        rounded-[18px]
                        bg-white
                        border
                        border-black/[0.06]
                        text-gray-400
                        text-sm
                        font-medium
                        hover:text-red-600
                        hover:bg-red-50
                      "
                    >

                      <Trash2 size={16} />

                      Delete

                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </Card>

        {completedAppointments.length > 0 && (

          <Card className="2xl:col-start-2">

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">

              <SectionHeader
                eyebrow="History"
                title="Completed Visits"
                subtitle="Completed appointments are now part of client treatment history."
              />

              <Badge variant="light">
                {completedAppointments.length} Completed
              </Badge>

            </div>

            <div className="space-y-3">

              {completedAppointments.slice(0, 6).map((appointment) => (

                <div
                  key={appointment.id}
                  className="
                    flex
                    flex-col
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    gap-4
                    rounded-[24px]
                    border
                    border-black/[0.04]
                    bg-[#fcfcfb]
                    p-5
                  "
                >

                  <div className="min-w-0">

                    <p className="font-semibold truncate">
                      {appointment.treatment}
                    </p>

                    <Link
                      to={`/client/${appointment.clientId}`}
                      className="text-sm text-gray-500 hover:text-black"
                    >
                      {appointment.clientName || "Client"}
                    </Link>

                  </div>

                  <p className="text-sm text-gray-500 whitespace-nowrap">
                    {formatDisplayDate(appointment.date)}
                  </p>

                </div>

              ))}

            </div>

          </Card>

        )}

      </div>

    </Layout>

  );

}
