<script>
  import { onMount } from 'svelte';
  import { supabase } from './supabase';

  let count = $state(0);
  function counter() {
    count++;
  }

  let contacts = $state([]);
  let inputName = $state('');
  let inputPhone = $state('');
  let loading = $state(true);

  let editingId = $state(null);
  let editName = $state('');
  let editPhone = $state('');

  async function fetchContacts() {
    loading = true;
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Gagal memuat data:', error.message);
    } else {
      contacts = data;
    }
    loading = false;
  }

  onMount(() => {
    fetchContacts();
  });

  async function handleSubmit(event) {
    event.preventDefault();
    if (!inputName || !inputPhone) return;

    const { data, error } = await supabase
      .from('contacts')
      .insert([{ name: inputName, phone: inputPhone }])
      .select();

    if (error) {
      alert('Gagal menambah data: ' + error.message);
    } else {
      contacts = [...contacts, data[0]];
      inputName = '';
      inputPhone = '';
    }
  }

  async function handleDelete(id) {
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Gagal menghapus data: ' + error.message);
    } else {
      contacts = contacts.filter(c => c.id !== id);
    }
  }

  function startEdit(item) {
    editingId = item.id;
    editName = item.name;
    editPhone = item.phone;
  }

  async function saveEdit(id) {
    const { error } = await supabase
      .from('contacts')
      .update({ name: editName, phone: editPhone })
      .eq('id', id);

    if (error) {
      alert('Gagal mengupdate data: ' + error.message);
    } else {
      contacts = contacts.map(c => c.id === id ? { ...c, name: editName, phone: editPhone } : c);
      editingId = null;
    }
  }

  function cancelEdit() {
    editingId = null;
  }
</script>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 650px;
    padding: 20px;
    box-sizing: border-box;
  }

  h1 {
    color: #ff5722;
    margin: 5px 0;
    text-align: center;
    font-size: 24px;
  }

  h2 {
    color: #2196f3;
    margin: 15px 0;
    font-size: 18px;
  }

  button.click-me {
    background-color: #333;
    color: white;
    border: 1px solid #555;
    padding: 8px 20px;
    width: 100%;
    max-width: 400px;
    cursor: pointer;
    margin-bottom: 20px;
    border-radius: 4px;
  }

  form {
    display: flex;
    gap: 10px;
    width: 100%;
    max-width: 500px;
    margin-bottom: 30px;
  }

  input {
    background-color: #1e222d;
    border: 1px solid #444;
    color: white;
    padding: 8px 12px;
    border-radius: 4px;
    flex: 1;
  }

  form button[type="submit"] {
    background-color: #f0f0f0;
    color: black;
    border: none;
    padding: 8px 16px;
    font-weight: bold;
    border-radius: 4px;
    cursor: pointer;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    background-color: #1e222d;
    border-radius: 6px;
    overflow: hidden;
    border: 1px solid #333;
  }

  th, td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #2a2e3d;
  }

  th {
    color: #ff5722;
    font-weight: bold;
  }

  /* Mengatur tombol agar sejajar ke samping */
  .action-buttons {
    display: flex;
    gap: 6px;
  }

  .btn-edit {
    background-color: #444;
    color: #fff;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
  }

  .btn-delete {
    background-color: #ff3b47;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
  }

  .btn-save {
    background-color: #4caf50;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
  }

  .btn-cancel {
    background-color: #777;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
  }

  .edit-input {
    padding: 4px 8px;
    width: 90%;
  }
</style>

<div class="container">
  {#if contacts.length > 0}
    <h1>Name: {contacts[contacts.length - 1].name}</h1>
    <h1>Phone: {contacts[contacts.length - 1].phone}</h1>
  {:else}
    <h1>Name: -</h1>
    <h1>Phone: -</h1>
  {/if}

  <h2>Count: {count}</h2>

  <button class="click-me" onclick={counter}>Click Me</button>

  <!-- Form Input -->
  <form onsubmit={handleSubmit}>
    <input type="text" bind:value={inputName} placeholder="Enter your name" required />
    <input type="text" bind:value={inputPhone} placeholder="Enter phone number" required />
    <button type="submit">Submit</button>
  </form>

  <!-- Tabel Data -->
  <table>
    <thead>
      <tr>
        <th style="width: 10%;">No</th>
        <th style="width: 30%;">Nama</th>
        <th style="width: 35%;">Nomor Telepon</th>
        <th style="width: 25%;">Aksi</th>
      </tr>
    </thead>
    <tbody>
      {#if loading}
        <tr><td colspan="4" style="text-align: center;">Memuat data...</td></tr>
      {:else if contacts.length === 0}
        <tr><td colspan="4" style="text-align: center;">Belum ada data.</td></tr>
      {:else}
        {#each contacts as item, index}
          <tr>
            <td>{index + 1}</td>
            <td>
              {#if editingId === item.id}
                <input class="edit-input" type="text" bind:value={editName} />
              {:else}
                {item.name}
              {/if}
            </td>
            <td>
              {#if editingId === item.id}
                <input class="edit-input" type="text" bind:value={editPhone} />
              {:else}
                {item.phone}
              {/if}
            </td>
            <td>
              <div class="action-buttons">
                {#if editingId === item.id}
                  <button class="btn-save" onclick={() => saveEdit(item.id)}>Simpan</button>
                  <button class="btn-cancel" onclick={cancelEdit}>Batal</button>
                {:else}
                  <button class="btn-edit" onclick={() => startEdit(item)}>Edit</button>
                  <button class="btn-delete" onclick={() => handleDelete(item.id)}>Hapus</button>
                {/if}
              </div>
            </td>
          </tr>
        {/each}
      {/if}
    </tbody>
  </table>
</div>